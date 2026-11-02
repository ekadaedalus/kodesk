import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert
} from '@mui/material';
import api from '../services/api';

const languages = [
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚡',
    description: 'Learn C++ programming with hands-on challenges',
    color: '#0d8de0',
    bg: 'linear-gradient(155deg, #e7f5ff 0%, #d9eeff 100%)',
    border: '#b9dcf6'
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'Master Java programming fundamentals',
    color: '#d97706',
    bg: 'linear-gradient(155deg, #fff4e3 0%, #ffecd0 100%)',
    border: '#f3d8ad'
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    description: 'Start your Python journey with interactive coding',
    color: '#3f8f3f',
    bg: 'linear-gradient(155deg, #edfbe8 0%, #dcf4d4 100%)',
    border: '#c6e8bc'
  }
];

function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSelectedLanguage();
  }, []);

  const fetchSelectedLanguage = async () => {
    try {
      const response = await api.get('/languages/user/selected');
      if (response.data.selectedLanguage) {
        setSelectedLanguage(response.data.selectedLanguage.id);
      }
    } catch (error) {
      console.error('Error fetching selected language:', error);
    }
  };

  const handleSelectLanguage = async (languageId) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/languages/user/select', { languageId });
      if (response.data.success) {
        setSelectedLanguage(languageId);
        setMessage(`Successfully selected ${response.data.selectedLanguage.displayName}!`);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to select language');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Card sx={{ borderRadius: 4, border: '1px solid #d6e4f8', background: 'linear-gradient(155deg, #eef5ff 0%, #ffffff 100%)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#173a68' }}>
            Realms
          </Typography>
          <Typography variant="body1" sx={{ color: '#4f678b' }}>
            Choose your active language track. You can switch realms anytime.
          </Typography>
        </CardContent>
      </Card>

      {message && (
        <Alert severity={message.includes('Successfully') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2.4}>
        {languages.map((language) => (
          <Grid item xs={12} md={4} key={language.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: selectedLanguage === language.id ? '2px solid #1f58b2' : '1px solid #d8e4f5',
                boxShadow: selectedLanguage === language.id ? '0 12px 26px rgba(20, 54, 107, 0.14)' : 'none',
                background: language.bg
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box textAlign="center" mb={2}>
                  <Typography variant="h2">{language.icon}</Typography>
                </Box>
                <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 800, color: '#183a69' }}>
                  {language.name}
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#5b7293' }}>
                  {language.description}
                </Typography>
                {selectedLanguage === language.id && (
                  <Box mt={2} textAlign="center">
                    <Typography variant="body2" sx={{ color: '#1f58b2', fontWeight: 800 }}>
                      Currently Selected
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant={selectedLanguage === language.id ? 'outlined' : 'contained'}
                  onClick={() => handleSelectLanguage(language.id)}
                  disabled={loading}
                  sx={{
                    minWidth: 130,
                    fontWeight: 700,
                    ...(selectedLanguage !== language.id
                      ? { bgcolor: language.color, '&:hover': { filter: 'brightness(0.9)' } }
                      : { borderColor: '#1f58b2', color: '#1f58b2' })
                  }}
                >
                  {selectedLanguage === language.id ? 'Selected' : 'Select'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default LanguageSelection;

