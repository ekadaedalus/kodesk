import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  LinearProgress,
  Alert,
  Button,
  Stack,
  Chip
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function LearningContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLaunchpad = location.pathname === '/launchpad';
  const language = isLaunchpad ? null : location.pathname.slice(1); // remove leading /

  useEffect(() => {
    if (!isLaunchpad) {
      setLoading(true);
      const fetchContent = async () => {
        try {
          const res = await api.get(`/learning/${language}`);
          if (res.data && res.data.content) {
            // Ensure ordering by order_index
            const sorted = res.data.content.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            setContent(sorted);
            setSelectedTopic(sorted[0] || null);
          } else {
            setContent([]);
            setSelectedTopic(null);
          }
        } catch (error) {
          console.error('Error fetching learning content:', error);
          setContent([]);
          setSelectedTopic(null);
        } finally {
          setLoading(false);
        }
      };

      fetchContent();
    } else {
      setContent([]);
      setSelectedTopic(null);
      setLoading(false);
    }
  }, [location.pathname, isLaunchpad, language]);

  const { user } = useAuth();

  if (loading) {
    return <LinearProgress />;
  }

  const launchpadView = (
    <div>
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          mb: 4,
          gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: '0.08em' }}>
              🚀 Welcome to the Coding Launchpad
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '680px' }}>
              Reimagine your guest learning journey with a fresh, mission-style experience.
              Start with C++ fundamentals, level up with Java, and master Python in the final phase.
            </Typography>
          </Box>

          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(0, 217, 255, 0.18)',
              background: 'rgba(6, 14, 37, 0.96)',
              color: '#e8f7ff'
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#80d8ff', mb: 2, letterSpacing: '0.12em', fontWeight: 700 }}>
              MISSION PATH
            </Typography>
            <List dense>
              {[
                { label: 'C++', route: 'cpp', color: '#00d9ff' },
                { label: 'Java', route: 'java', color: '#39ff14' },
                { label: 'Python', route: 'python', color: '#ff006e' }
              ].map((item, index) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/${item.route}`)}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: item.color,
                          color: '#041b31',
                          fontWeight: 800
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" sx={{ mt: 3, color: 'rgba(255,255,255,0.72)' }}>
              Get a structured learning sequence that moves from system-level power to cross-platform mastery, then into versatile scripting and rapid development.
            </Typography>
          </Paper>
        </Box>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2
          }}
        >
          <Box
            component="img"
            src="/assets/space-astronaut.gif"
            alt="Space Astronaut"
            sx={{
              width: '100%',
              maxWidth: 520,
              borderRadius: 4,
              boxShadow: '0 0 80px rgba(0, 217, 255, 0.35)',
              border: '2px solid rgba(0, 217, 255, 0.16)',
              backgroundColor: 'rgba(0,0,0,0.02)'
            }}
          />
        </Box>
      </Box>
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isLaunchpad ? launchpadView : 'Loading language content...'}
      {!user && isLaunchpad && (
        <Alert severity="success" sx={{ mb: 3, maxWidth: '600px', mx: 'auto', bgcolor: '#e8f5e9', borderColor: '#4caf50', border: '2px solid' }}>
          <Typography sx={{ mb: 1.5 }}>
            🚀 <strong>Ready to start learning and complete quests?</strong>
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Create an account or login to unlock interactive quests, arcade earn XP points, and track your progress!
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" size="medium" onClick={() => navigate('/register')} sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}>
              Get Started - Sign Up
            </Button>
            <Button variant="outlined" size="medium" onClick={() => navigate('/login')} sx={{ borderColor: '#4caf50', color: '#4caf50' }}>
              Already a Member - Login
            </Button>
          </Stack>
        </Alert>
      )}
    </Container>
  );
}

export default LearningContent;
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" size="medium" onClick={() => navigate('/register')} sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}>
            Get Started - Sign Up
          </Button>
          <Button variant="outlined" size="medium" onClick={() => navigate('/login')} sx={{ borderColor: '#4caf50', color: '#4caf50' }}>
            Already a Member - Login
          </Button>
        </Stack>
      </Alert>
    )}
  </Container>
  );
}

export default LearningContent;

