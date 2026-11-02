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

  const { user } = useAuth();
  const currentPath = location.pathname;
  const isLaunchpad = currentPath === '/launchpad';
  const isLearningHome = currentPath === '/learning';
  const languageRoutes = ['cpp', 'java', 'python'];
  const pathSegments = currentPath.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || '';
  const language = languageRoutes.includes(lastSegment) ? lastSegment : null;
  const languageTheme = {
    cpp: {
      accent: '#0d8de0',
      soft: '#e9f6ff',
      border: '#b9dcf6',
      heading: 'C++ Systems Track',
      subtitle: 'Performance-focused path for memory, STL, and systems thinking.'
    },
    java: {
      accent: '#d97706',
      soft: '#fff6e9',
      border: '#f3d8ad',
      heading: 'Java Architecture Track',
      subtitle: 'Object-oriented progression for scalable and maintainable software.'
    },
    python: {
      accent: '#3f8f3f',
      soft: '#eefbea',
      border: '#c6e8bc',
      heading: 'Python Productivity Track',
      subtitle: 'Fast development path for scripting, automation, and applied coding.'
    }
  };
  const activeTheme = language ? languageTheme[language] : null;

  useEffect(() => {
    if (language) {
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
  }, [location.pathname, language]);

  if (loading) {
    return <LinearProgress />;
  }

  const selectedTopicIndex = content.findIndex((item) => item.id === selectedTopic?.id);
  const formattedCodeExample = selectedTopic?.code_examples?.replace(/\\n/g, '\n');

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
          {!user && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, md: 2.6 },
                borderRadius: 4,
                border: '1px solid rgba(0, 217, 255, 0.28)',
                background: 'linear-gradient(130deg, rgba(7,20,46,0.98) 0%, rgba(19,62,95,0.95) 100%)',
                color: '#dff7ff',
                boxShadow: '0 18px 36px rgba(0, 0, 0, 0.28)'
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#90e8ff', letterSpacing: '0.11em', fontWeight: 700, mb: 1 }}>
                START YOUR ACCOUNT
              </Typography>
              <Typography variant="body2" sx={{ mb: 2.2, color: 'rgba(232, 247, 255, 0.92)' }}>
                Join now to unlock quests, track your XP, and save every mission milestone.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: '#00d9ff',
                    color: '#02263c',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#67e8ff' }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: '#00d9ff',
                    color: '#b2f4ff',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: '#67e8ff',
                      backgroundColor: 'rgba(103, 232, 255, 0.08)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            </Paper>
          )}

          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(0, 217, 255, 0.18)',
              background: 'linear-gradient(150deg, rgba(6, 14, 37, 0.96) 0%, rgba(17, 35, 64, 0.94) 100%)',
              color: '#e8f7ff',
              boxShadow: '0 18px 42px rgba(4, 19, 49, 0.5)'
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
            p: 2.5
          }}
        >
          <Box
            component="img"
            src="/assets/space-astronaut.gif"
            alt="Space Astronaut"
            sx={{
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 0 80px rgba(0, 217, 255, 0.35)',
              border: '2px solid rgba(0, 217, 255, 0.16)',
              backgroundColor: 'rgba(0,0,0,0.02)',
              objectFit: 'cover'
            }}
          />
        </Box>
      </Box>
    </div>
  );

  const learningHomeView = (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2.2
        }}
      >
        {[
          { label: 'C++', route: '/learning/cpp', description: 'Build strong fundamentals in memory, performance, and control flow.', color: '#0d8de0', bg: 'linear-gradient(155deg, #e7f5ff 0%, #d9eeff 100%)' },
          { label: 'Java', route: '/learning/java', description: 'Master object-oriented patterns and scalable application structure.', color: '#d97706', bg: 'linear-gradient(155deg, #fff4e3 0%, #ffecd0 100%)' },
          { label: 'Python', route: '/learning/python', description: 'Learn fast scripting, automation, and productive coding workflows.', color: '#3f8f3f', bg: 'linear-gradient(155deg, #edfbe8 0%, #dcf4d4 100%)' }
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              p: 2.6,
              borderRadius: 3,
              border: `1px solid ${item.color}55`,
              background: item.bg,
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 220,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 18px rgba(31, 62, 112, 0.12)'
              }
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: item.color, mb: 1 }}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#35506f', mb: 2.2, flex: 1 }}>
              {item.description}
            </Typography>
            <Chip
              size="small"
              label="10 Learning Topics"
              sx={{
                alignSelf: 'flex-start',
                mb: 1.5,
                border: `1px solid ${item.color}66`,
                color: item.color,
                backgroundColor: '#ffffffaa',
                fontWeight: 700
              }}
            />
            <Button
              variant="contained"
              onClick={() => navigate(item.route)}
              sx={{
                alignSelf: 'flex-start',
                bgcolor: item.color,
                fontWeight: 700,
                '&:hover': { filter: 'brightness(0.9)' }
              }}
            >
              Learn {item.label}
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );

  const languageView = (
    <div>
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          border: `1px solid ${activeTheme?.border}`,
          background: activeTheme?.soft
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: activeTheme?.accent }}>
          {activeTheme?.heading}
        </Typography>
        <Typography variant="body1" sx={{ color: '#3f5f84' }}>
          {activeTheme?.subtitle}
        </Typography>
        <Typography variant="body2" sx={{ color: '#5b7394', mt: 1 }}>
          Topics 1 to 10: {language?.toUpperCase()}: Getting Started to {language?.toUpperCase()}: Exception Handling
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 3.2 }}>
        {/* Left Sidebar - Topics List */}
        <Paper
          sx={{
            width: 300,
            maxHeight: 'calc(100vh - 130px)',
            position: 'sticky',
            top: 92,
            zIndex: 1,
            backgroundColor: '#ffffff',
            boxShadow: '0 14px 32px rgba(7, 22, 48, 0.28)',
            borderRadius: 3,
            border: `2px solid ${activeTheme?.border}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ bgcolor: activeTheme?.accent, color: 'white', p: 2.2, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              📖 Topics 1-10
            </Typography>
          </Box>
          <List
            sx={{
              p: 0,
              m: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: '#ffffff',
              '&::-webkit-scrollbar': {
                width: '10px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#d9e8ff'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: activeTheme?.accent,
                borderRadius: '10px'
              }
            }}
          >
            {content.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedTopic?.id === item.id}
                    onClick={() => setSelectedTopic(item)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#f7fbff',
                        borderLeft: `5px solid ${activeTheme?.accent}`
                      },
                      '&:hover': {
                        backgroundColor: '#f2f7ff'
                      }
                    }}
                  >
                    <Chip
                      size="small"
                      label={index + 1}
                      sx={{
                        mr: 1.2,
                        minWidth: 28,
                        bgcolor: activeTheme?.soft,
                        border: `1px solid ${activeTheme?.border}`,
                        fontWeight: 700
                      }}
                    />
                    <ListItemText
                      primary={item.title}
                      secondary={item.topic}
                      primaryTypographyProps={{ sx: { color: '#16273f', fontWeight: selectedTopic?.id === item.id ? 800 : 600, fontSize: '15px' } }}
                      secondaryTypographyProps={{ sx: { color: '#4f6483', fontSize: '12px', fontWeight: 500 } }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < content.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Right Content Area */}
        <Paper
          sx={{
            flex: 1,
            p: 4,
            bgcolor: '#ffffff',
            boxShadow: '0 14px 34px rgba(7, 22, 48, 0.26)',
            border: `2px solid ${activeTheme?.border}`,
            borderRadius: 3
          }}
        >
          {selectedTopic ? (
            <Box>
              <Chip
                size="small"
                label={`Topic ${selectedTopicIndex + 1} of ${content.length}`}
                sx={{
                  mb: 1.2,
                  bgcolor: activeTheme?.soft,
                  border: `1px solid ${activeTheme?.border}`,
                  color: activeTheme?.accent,
                  fontWeight: 700
                }}
              />
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  border: `2px solid ${activeTheme?.accent}`,
                  background: `linear-gradient(155deg, ${activeTheme?.soft} 0%, #ffffff 100%)`,
                  boxShadow: '0 10px 24px rgba(7, 22, 48, 0.18)'
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: activeTheme?.accent, mb: 2.2, pb: 1.5, borderBottom: `3px solid ${activeTheme?.accent}` }}>
                  {selectedTopic.title}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 2.05, color: '#142437', fontSize: '17px', mb: 0, fontWeight: 500 }}>
                  {selectedTopic.content}
                </Typography>
              </Box>
              {formattedCodeExample && (
                <Box sx={{ mt: 4, p: 3, bgcolor: activeTheme?.soft, borderRadius: 2.5, border: `2px solid ${activeTheme?.accent}`, boxShadow: '0 10px 24px rgba(7, 22, 48, 0.20)' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: activeTheme?.accent, mb: 2 }}>
                    💻 Code Example
                  </Typography>
                  <Box sx={{ p: 2.2, bgcolor: '#0b1728', borderRadius: 1.5, overflow: 'auto', border: '1px solid #1a2f4c' }}>
                    <pre style={{ margin: 0, color: '#d8e7ff', fontSize: '14px', lineHeight: '1.7', fontFamily: 'Consolas, Monaco, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {formattedCodeExample}
                    </pre>
                  </Box>
                </Box>
              )}
              {user && (
                <Box sx={{ mt: 4, p: 2, bgcolor: '#ecfff0', border: '2px solid #53b56b', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#195c2d', fontWeight: 600 }}>
                    Some content may be missing. Please be patient. Head to <strong>Quests</strong> to practice your skills.
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '18px', color: '#999' }}>
                ☜ Select a topic from the left to get started!
              </Typography>
              {content.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Available topics:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {content.map((item) => (
                      <Chip
                        key={item.id}
                        label={item.title}
                        onClick={() => setSelectedTopic(item)}
                        variant="outlined"
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isLaunchpad ? launchpadView : isLearningHome ? learningHomeView : languageView}
    </Container>
  );
}

export default LearningContent;