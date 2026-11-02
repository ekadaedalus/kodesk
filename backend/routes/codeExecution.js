const express = require('express');
const { authenticate } = require('../middleware/auth');
const Task = require('../models/Task');
const Progress = require('../models/Progress');

const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';
const debugLog = (...args) => { if (isDev) console.log(...args); };

// Remote code execution via Judge0 (Render can't run Docker, and running untrusted
// code in-process would expose server secrets). Defaults to the free public CE instance.
const JUDGE0_URL = (process.env.JUDGE0_URL || 'https://ce.judge0.com').replace(/\/+$/, '');
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const REQUEST_TIMEOUT_MS = 30000;

// Judge0 language IDs
const LANGUAGE_CONFIGS = {
  cpp: { languageId: 54 },    // C++ (GCC 9.2.0)
  java: { languageId: 91 },   // Java (JDK 17.0.6)
  python: { languageId: 71 }  // Python (3.8.1)
};

// Judge0 compiles Java as Main.java, so the public class must be named Main
const prepareSource = (code, language) => {
  if (language !== 'java') return code;
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  if (!classMatch || classMatch[1] === 'Main') return code;
  return code.replace(new RegExp(`\\b${classMatch[1]}\\b`, 'g'), 'Main');
};

const judge0Headers = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (JUDGE0_API_KEY) {
    if (JUDGE0_URL.includes('rapidapi.com')) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = new URL(JUDGE0_URL).host;
    } else {
      headers['X-Auth-Token'] = JUDGE0_API_KEY;
    }
  }
  return headers;
};

const toBase64 = (str) => Buffer.from(str || '', 'utf8').toString('base64');
const fromBase64 = (str) => (str ? Buffer.from(str, 'base64').toString('utf8') : '');

// Helper function to clean output (remove control characters, normalize line endings, etc.)
const cleanString = (str) => {
  return str
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')  // Remove control characters
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\r/g, '\n')  // Convert \r to \n
    .trim();
};

// Normalize output for judge comparison while keeping semantic text intact.
const normalizeForComparison = (str = '') => {
  const cleaned = cleanString(str);
  if (!cleaned) return '';
  // Treat all whitespace (spaces/tabs/newlines) uniformly for judging.
  // This prevents false negatives when learners print valid output with different formatting.
  return cleaned
    .replace(/\s+/g, ' ')
    .trim();
};

// Execute code via Judge0
async function executeCode(code, language, input = '') {
  const config = LANGUAGE_CONFIGS[language];
  if (!config) {
    throw new Error('Unsupported language');
  }

  const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: judge0Headers(),
    body: JSON.stringify({
      language_id: config.languageId,
      source_code: toBase64(prepareSource(code, language)),
      stdin: toBase64(input),
      cpu_time_limit: 5,
      wall_time_limit: 10,
      memory_limit: 256000
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Execution service error (${response.status}): ${body.slice(0, 200)}`);
  }

  const result = await response.json();
  debugLog('[DEBUG] Judge0 status:', result.status);

  const stdout = cleanString(fromBase64(result.stdout));
  const stderr = cleanString(fromBase64(result.stderr));
  const compileOutput = cleanString(fromBase64(result.compile_output));
  const message = cleanString(fromBase64(result.message));

  // Status 3 = Accepted; 5 = Time Limit Exceeded; 6 = Compilation Error; 7-12 = runtime errors
  const statusId = result.status && result.status.id;
  if (statusId === 3) {
    return { output: stdout, errors: stderr, exitCode: 0 };
  }

  let errors;
  if (statusId === 5) {
    errors = 'Execution timeout';
  } else {
    errors = compileOutput || stderr || message || (result.status && result.status.description) || 'Execution failed';
  }
  return { output: stdout, errors, exitCode: result.exit_code || 1 };
}

// Execute and evaluate code
router.post('/evaluate', authenticate, async (req, res) => {
  try {
    const { taskId, code, language } = req.body;

    if (!taskId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: taskId, code, language'
      });
    }

    // Get task with test cases
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.language !== language) {
      return res.status(400).json({
        success: false,
        message: 'Language mismatch'
      });
    }

    const testCases = task.test_cases || [];
    const results = [];
    let allPassed = true;

    // Run each test case
    for (const testCase of testCases) {
      try {
        console.log(`[DEBUG] Running test case with input: ${JSON.stringify(testCase.input)}`);
        console.log(`[DEBUG] Expected output: ${JSON.stringify(testCase.expected_output)}`);
        
        const { output, errors, exitCode } = await executeCode(
          code,
          language,
          testCase.input || ''
        );

        // Clean both outputs for comparison
        const cleanedOutput = cleanString(output);
        const cleanedExpected = cleanString(testCase.expected_output || '');
        const normalizedOutput = normalizeForComparison(cleanedOutput);
        const normalizedExpected = normalizeForComparison(cleanedExpected);

        console.log(`[DEBUG] Raw output: ${JSON.stringify(output)}`);
        console.log(`[DEBUG] Cleaned output: ${JSON.stringify(cleanedOutput)}`);
        console.log(`[DEBUG] Cleaned expected: ${JSON.stringify(cleanedExpected)}`);
        console.log(`[DEBUG] Exit code: ${exitCode}`);
        console.log(`[DEBUG] Match result: ${normalizedOutput === normalizedExpected}`);

        const passed = exitCode === 0 && normalizedOutput === normalizedExpected;

        results.push({
          input: testCase.input,
          expected_output: testCase.expected_output,
          actual_output: cleanedOutput,
          errors: errors,
          passed: passed,
          is_hidden: testCase.is_hidden || false
        });

        if (!passed) {
          allPassed = false;
        }
      } catch (error) {
        console.error(`[DEBUG] Error executing test case:`, error);
        console.error('[DEBUG] Error message:', error.message);
        console.error('[DEBUG] Error stack:', error.stack);
        
        results.push({
          input: testCase.input,
          expected_output: testCase.expected_output,
          actual_output: '',
          errors: `Execution error: ${error.message}`,
          passed: false,
          is_hidden: testCase.is_hidden || false
        });
        allPassed = false;
      }
    }

    // Calculate score and XP (guard against zero test cases)
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
    const xp = totalCount === 0 ? 0 : allPassed ? 100 : Math.round((passedCount / totalCount) * 50);

    // Save submission
    const verdict = allPassed ? 'Pass' : 'Fail';
    await Progress.saveSubmission(
      req.user.id,
      taskId,
      language,
      code,
      verdict,
      JSON.stringify(results),
      ''
    );

    // If all tests passed, mark task as completed and unlock games
    let unlockedGames = [];
    if (allPassed) {
      await Progress.recordTaskCompletion(req.user.id, taskId, language, score, xp);
      unlockedGames = await Progress.unlockGamesForTask(req.user.id, taskId, language);
    }

    res.json({
      success: true,
      verdict: verdict,
      results: results.filter(r => !r.is_hidden), // Only show visible test cases
      score,
      xp,
      allPassed,
      unlockedGames: unlockedGames,
      message: allPassed ? 'All test cases passed! 🎉' : 'Some test cases failed. Try again!'
    });

  } catch (error) {
    console.error('[DEBUG] Code evaluation error:', error);
    console.error('[DEBUG] Error message:', error.message);
    console.error('[DEBUG] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Code execution failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Simple code execution (without evaluation)
router.post('/run', authenticate, async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: code, language'
      });
    }

    console.log(`[DEBUG] Running code for language: ${language}`);
    const { output, errors, exitCode } = await executeCode(code, language, input);

    // Log output before sending to frontend
    debugLog('[DEBUG] Final output being sent to frontend:', JSON.stringify(output));
    debugLog('[DEBUG] Final errors being sent to frontend:', JSON.stringify(errors));
    debugLog('[DEBUG] Final exitCode:', exitCode);

    res.json({
      success: true,
      output,
      errors,
      exitCode
    });

  } catch (error) {
    console.error('[DEBUG] Code execution error:', error);
    console.error('[DEBUG] Error message:', error.message);
    console.error('[DEBUG] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Code execution failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
