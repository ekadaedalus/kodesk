import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  LinearProgress,
  CircularProgress,
  Stack,
  Avatar,
  Paper
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  FlashOn as ZapIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import api from '../services/api';

function Tasks() {
  const { language } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [language]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/language/${language}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyInfo = (difficulty) => {
    const difficulties = {
      beginner: { label: 'Beginner', color: '#2e7d32' },
      intermediate: { label: 'Intermediate', color: '#ed6c02' },
      advanced: { label: 'Advanced', color: '#d32f2f' }
    };
    return difficulties[difficulty] || { label: 'Unknown', color: '#1f58b2' };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const completedCount = tasks.filter(t => t.is_completed).length;
  const unlockedCount = tasks.filter(t => t.is_unlocked).length;

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #d7e3f3',
          background: 'linear-gradient(160deg, #eef4ff 0%, #e8f0ff 100%)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#163761' }}>
              Quest Board
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#4a6388' }}>
              Complete all 10 quests for {language?.toUpperCase()} to master the track.
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Box>
                <Typography variant="caption" sx={{ color: '#6b7f9f' }}>
                  PROGRESS
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f58b2' }}>
                  {completedCount}/{tasks.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#6b7f9f' }}>
                  UNLOCKED
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f58b2' }}>
                  {unlockedCount}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#6b7f9f' }}>
                  COMPLETION
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(completedCount / tasks.length) * 100}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    background: '#dbe7fb',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #1f58b2, #3a78db)'
                    }
                  }}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                background: 'linear-gradient(135deg, #1f58b2, #3a78db)',
                fontSize: '3rem',
                fontWeight: 800,
                ml: { xs: 0, md: 'auto' }
              }}
            >
              {completedCount}
            </Avatar>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {tasks.map((task) => {
          const diffInfo = getDifficultyInfo(task.difficulty_level);
          return (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                onClick={() => task.is_unlocked && navigate(`/task/${task.id}`)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: task.is_completed ? '1px solid #66bb6a' : task.is_unlocked ? '1px solid #c9daf5' : '1px solid #e2e8f2',
                  backgroundColor: '#ffffff',
                  opacity: task.is_unlocked ? 1 : 0.72,
                  cursor: task.is_unlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  '&:hover': task.is_unlocked ? { boxShadow: '0 10px 24px rgba(21, 62, 120, 0.14)', transform: 'translateY(-2px)' } : {}
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Chip label={`Quest ${task.level_number}`} size="small" sx={{ fontWeight: 700, backgroundColor: '#e8f0ff', color: '#1f58b2' }} />
                    {task.is_completed ? (
                      <CheckCircleIcon sx={{ color: '#2e7d32' }} />
                    ) : task.is_unlocked ? null : (
                      <LockIcon sx={{ color: '#7d8ca3' }} />
                    )}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#173a67' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#516988', mb: 2, minHeight: 44 }}>
                    {task.description?.substring(0, 100)}...
                  </Typography>

                  <Chip
                    label={diffInfo.label}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: diffInfo.color,
                      color: diffInfo.color,
                      fontWeight: 700
                    }}
                  />

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#234f95', fontWeight: 700, fontSize: 13 }}>
                      <StarIcon sx={{ fontSize: 16 }} /> 100 XP
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#234f95', fontWeight: 700, fontSize: 13 }}>
                      <ZapIcon sx={{ fontSize: 16 }} /> 50 PTS
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    fullWidth
                    variant={task.is_unlocked ? 'contained' : 'outlined'}
                    disabled={!task.is_unlocked}
                    endIcon={<ArrowIcon />}
                    sx={{
                      fontWeight: 700,
                      bgcolor: task.is_unlocked ? '#1f58b2' : undefined,
                      '&:hover': task.is_unlocked ? { bgcolor: '#18478f' } : undefined
                    }}
                  >
                    {task.is_completed ? 'Completed' : task.is_unlocked ? 'Start Quest' : 'Locked'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {tasks.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(160deg, #f2f7ff 0%, #e8f0ff 100%)',
            border: '1px solid #ceddf5',
            borderRadius: 3,
            mt: 4
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Quests Available
          </Typography>
          <Typography variant="body2" sx={{ color: '#5d7495' }}>
            Check back later for new coding challenges!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default Tasks;
