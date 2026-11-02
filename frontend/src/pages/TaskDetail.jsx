import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import { PlayArrow as PlayIcon, Send as SendIcon } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../services/api';

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      setTask(response.data.task);
      setCode('');
    } catch (fetchError) {
      console.error('Error fetching task:', fetchError);
      setError('Failed to load task');
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setError('Please write some code first');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await api.post('/execute/run', {
        code,
        language: task.language,
        input: ''
      });
      const outputText = response.data.output?.trim() ? response.data.output : (response.data.errors || 'No output');
      setOutput(outputText);
    } catch (runError) {
      setError(runError.response?.data?.message || 'Code execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code first');
      return;
    }

    setEvaluating(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/execute/evaluate', {
        taskId: task.id,
        code,
        language: task.language
      });
      setResult(response.data);
      if (response.data.allPassed) {
        setTimeout(() => navigate(`/tasks/${task.language}`), 3000);
      }
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  if (!task) {
    return <LinearProgress />;
  }

  const sharedPanelStyle = {
    borderRadius: 3,
    border: '1px solid #c6dbf6',
    background: 'linear-gradient(160deg, #eef5ff 0%, #e8f1ff 100%)',
    boxShadow: '0 10px 24px rgba(24, 64, 120, 0.10)'
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#173c6b', mb: 0.8 }}>
          {task.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#4a6488', mb: 2 }}>
          Build your own solution and validate it against all hidden and visible test cases.
        </Typography>
        <Box display="flex" gap={1} mb={2.5}>
          <Chip label={task.difficulty_level} size="small" sx={{ fontWeight: 700, backgroundColor: '#dfeeff', color: '#1f58b2' }} />
          <Chip label={task.language.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ ...sharedPanelStyle, p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1f58b2', mb: 1.4 }}>
              Problem Description
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.9, color: '#1f2d3d' }}>
              {task.description}
            </Typography>
          </Paper>

          <Paper sx={{ ...sharedPanelStyle, p: 3 }}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #203854'
              }}
            >
              <Box
                sx={{
                  background: '#13263d',
                  px: 2,
                  py: 1.4,
                  color: '#c5e4ff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Code Editor
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {task.language.toUpperCase()} | {code.length} chars
                </Typography>
              </Box>

              <Box sx={{ backgroundColor: '#0b1728', p: 0 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Craft your solution with clean, readable code..."
                  variant="outlined"
                  autoComplete="off"
                  spellCheck="false"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      backgroundColor: '#0b1728',
                      color: '#d7e9ff'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '& textarea': {
                      fontFamily: '"JetBrains Mono", "Consolas", monospace',
                      fontSize: 14.5,
                      lineHeight: 1.85,
                      letterSpacing: '0.015em',
                      color: '#d7e9ff',
                      padding: '18px 20px'
                    },
                    '& textarea::placeholder': {
                      color: '#7f9abc',
                      opacity: 1
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 1.2, flexWrap: 'nowrap' }}>
              <Button variant="outlined" startIcon={<PlayIcon />} onClick={handleRun} disabled={loading} sx={{ fontWeight: 700, minWidth: 170 }}>
                {loading ? 'Running...' : 'Run Code'}
              </Button>
              <Button variant="contained" startIcon={<SendIcon />} onClick={handleSubmit} disabled={evaluating} sx={{ fontWeight: 700, minWidth: 190, bgcolor: '#1f58b2', '&:hover': { bgcolor: '#18468d' } }}>
                {evaluating ? 'Evaluating...' : 'Submit Solution'}
              </Button>
            </Box>
          </Paper>

          {output && (
            <Paper sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #243a54' }}>
              <Box sx={{ px: 2, py: 1.2, bgcolor: '#16263a', color: '#d2e7ff' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Output</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#0e1b2b', maxHeight: 300, overflow: 'auto' }}>
                <SyntaxHighlighter language={task.language} style={vscDarkPlus}>
                  {output}
                </SyntaxHighlighter>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {result && (
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #c6dbf6', background: '#fff' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1f58b2' }}>
                Evaluation Results
              </Typography>
              <Alert severity={result.allPassed ? 'success' : 'warning'} sx={{ mb: 2 }}>
                {result.message}
              </Alert>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                Score: {result.score}/100 | XP: {result.xp}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {result.results?.map((testResult, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Chip
                    label={testResult.passed ? 'Passed' : 'Failed'}
                    color={testResult.passed ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1, fontWeight: 700 }}
                  />
                  <Typography variant="body2" component="span" sx={{ fontWeight: 700 }}>
                    Test Case {index + 1}
                  </Typography>
                  {!testResult.passed && (
                    <Box sx={{ mt: 1.2, p: 1.5, borderRadius: 1.5, bgcolor: '#fff5f5', border: '1px solid #f2b8b8' }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#8a2a2a', mb: 0.5 }}>
                        Expected
                      </Typography>
                      <Typography sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mb: 1.2 }}>
                        {testResult.expected_output}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#8a2a2a', mb: 0.5 }}>
                        Your Output
                      </Typography>
                      <Typography sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {testResult.actual_output || '(empty)'}
                      </Typography>
                      {testResult.errors && (
                        <Box sx={{ mt: 1.2, p: 1.5, borderRadius: 1.5, bgcolor: '#f4f4ff', border: '1px solid #c3c3ff' }}>
                          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#2f2fa3', mb: 0.5 }}>
                            Error Details
                          </Typography>
                          <Typography sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: '#2d2d5a' }}>
                            {testResult.errors}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
              {result.allPassed && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Redirecting to quests in 3 seconds...
                </Alert>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default TaskDetail;
