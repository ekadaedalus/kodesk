import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSuccess) return undefined;

    const timer = window.setTimeout(() => {
      navigate('/hub');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [showSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setShowSuccess(true);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%', position: 'relative', overflow: 'hidden' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            KODESK
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Login to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || showSuccess}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography variant="body2" align="center">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/launchpad')}>
              Explore as Guest
            </Button>
          </Box>

          </Paper>
        </Box>
      </Container>

      {showSuccess && createPortal(
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            overflow: 'hidden',
            backgroundColor: '#000'
          }}
        >
          <Box
            component="img"
            src="/assets/login.gif"
            alt="Login Success"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block'
            }}
          />
        </Box>,
        document.body
      )}
    </>
  );
}

export default Login;

