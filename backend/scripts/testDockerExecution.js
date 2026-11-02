#!/usr/bin/env node

/**
 * Docker Execution Diagnostic Script
 * 
 * This script tests the Docker execution independently to diagnose issues
 * Run from backend directory: node scripts/testDockerExecution.js
 */

const Docker = require('dockerode');

const dockerSocketPath = process.env.DOCKER_SOCKET_PATH ||
  (process.platform === 'win32' ? '\\\\.\\pipe\\docker_engine' : '/var/run/docker.sock');

const docker = new Docker({
  socketPath: dockerSocketPath
});

// Test configurations
const tests = [
  {
    name: 'C++ - Hello World',
    language: 'cpp',
    image: 'gcc:latest',
    code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    expected: 'Hello, World!'
  },
  {
    name: 'Python - Hello World',
    language: 'python',
    image: 'python:3.11',
    code: 'print("Hello, World!")',
    expected: 'Hello, World!'
  },
  {
    name: 'Java - Hello World',
    language: 'java',
    image: 'amazoncorretto:17',
    code: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    expected: 'Hello, World!'
  }
];

// Helper function to clean output
const cleanString = (str) => {
  return str
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
};

// Build Docker commands
const buildCommand = (code, language) => {
  switch (language) {
    case 'cpp':
      return `echo '${code.replace(/'/g, "'\\''")}' > /tmp/code.cpp && g++ -o /tmp/code /tmp/code.cpp && /tmp/code`;
    case 'python':
      return `python3 -c '${code.replace(/'/g, "'\\''")}'`;
    case 'java':
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classMatch ? classMatch[1] : 'Solution';
      return `echo '${code.replace(/'/g, "'\\''")}' > /tmp/${className}.java && cd /tmp && javac ${className}.java && java ${className}`;
    default:
      throw new Error('Unknown language');
  }
};

// Execute single test
async function executeTest(test) {
  console.log('\n' + '='.repeat(60));
  console.log(`Testing: ${test.name}`);
  console.log('='.repeat(60));

  let container;
  try {
    const command = buildCommand(test.code, test.language);
    console.log(`Command: ${command.substring(0, 100)}...`);
    console.log(`Image: ${test.image}`);

    // Create container
    container = await docker.createContainer({
      Image: test.image,
      Cmd: ['/bin/sh', '-c', command],
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      OpenStdin: false,
      NetworkDisabled: true,
      Memory: 128 * 1024 * 1024,
    });

    console.log('✓ Container created');

    // Start container
    await container.start();
    console.log('✓ Container started');

    // Wait for exit
    const exitData = await container.wait();
    const exitCode = exitData.StatusCode !== undefined ? exitData.StatusCode : exitData;
    console.log(`✓ Container exited with code: ${exitCode}`);

    // Get logs separately
    const stdoutLogs = await container.logs({
      stdout: true,
      stderr: false,
      timestamps: false
    });
    const stdout = stdoutLogs.toString('utf8');

    const stderrLogs = await container.logs({
      stdout: false,
      stderr: true,
      timestamps: false
    });
    const stderr = stderrLogs.toString('utf8');

    // Clean output
    const cleanedStdout = cleanString(stdout);
    const cleanedStderr = cleanString(stderr);

    console.log('\nOutput Streams:');
    console.log(`  Raw stdout: ${JSON.stringify(stdout)}`);
    console.log(`  Raw stderr: ${JSON.stringify(stderr)}`);
    console.log(`  Cleaned stdout: ${JSON.stringify(cleanedStdout)}`);
    console.log(`  Cleaned stderr: ${JSON.stringify(cleanedStderr)}`);

    // Determine final output/errors
    let output = '';
    let errors = '';
    if (exitCode === 0) {
      output = cleanedStdout;
      errors = cleanedStderr;
    } else {
      errors = cleanedStderr || cleanedStdout;
      output = cleanedStdout;
    }

    console.log('\nFinal Response:');
    console.log(`  output: ${JSON.stringify(output)}`);
    console.log(`  errors: ${JSON.stringify(errors)}`);
    console.log(`  exitCode: ${exitCode}`);

    // Check if it matches expected
    const matches = cleanedStdout.includes(test.expected);
    console.log(`\nExpected Output: ${JSON.stringify(test.expected)}`);
    console.log(`Match: ${matches ? '✓ YES' : '✗ NO'}`);

    // Cleanup
    await container.remove();

    return { success: matches, test: test.name };
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    console.error('Stack:', error.stack);

    if (container) {
      try {
        await container.remove();
      } catch (err) {
        // Ignore
      }
    }

    return { success: false, test: test.name, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🧪 DOCKER EXECUTION DIAGNOSTIC TEST');
  console.log('====================================\n');

  // Check Docker connection
  try {
    const info = await docker.getEvents({ filters: { type: ['build'] } });
    console.log('✓ Docker connection successful\n');
  } catch (error) {
    console.error('✗ Docker connection failed:', error.message);
    console.error('Make sure Docker daemon is running!\n');
    process.exit(1);
  }

  // Run each test
  const results = [];
  for (const test of tests) {
    const result = await executeTest(test);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach(result => {
    const status = result.success ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${result.test}`);
    if (result.error) {
      console.log(`       ${result.error}`);
    }
  });

  console.log(`\nTotal: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Docker execution is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
