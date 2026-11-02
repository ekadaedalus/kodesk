import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  Avatar,
  Chip
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, fetchUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/users/profile', { name, email });
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        fetchUser();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid #d6e4f8', background: 'linear-gradient(160deg, #eef5ff 0%, #ffffff 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#1f58b2', fontWeight: 800, fontSize: 28 }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#173a68' }}>
              Profile
            </Typography>
            <Typography sx={{ color: '#4f678b' }}>
              Manage your account details and personal identity.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #d7e4f6', boxShadow: '0 10px 24px rgba(15, 49, 99, 0.10)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1f58b2' }}>
              Personal Information
            </Typography>
            {message && (
              <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            <form onSubmit={handleUpdate}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, bgcolor: '#1f58b2', fontWeight: 700, '&:hover': { bgcolor: '#18488f' } }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #d7e4f6' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1f58b2' }}>
                Account Information
              </Typography>
              <Chip
                label={`Role: ${user?.role || 'Student'}`}
                size="small"
                sx={{ mb: 1.2, bgcolor: '#e8f0ff', color: '#1f58b2', fontWeight: 700 }}
              />
              <Typography variant="body2" sx={{ color: '#5b7293' }}>
                Username: {user?.username || user?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5b7293', mt: 0.8 }}>
                User ID: {user?.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;

