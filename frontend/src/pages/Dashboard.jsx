import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Code as CodeIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  SportsEsports as SportsEsportsIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const langResponse = await api.get('/languages/user/selected');
        if (langResponse.data.selectedLanguage) {
          setSelectedLanguage(langResponse.data.selectedLanguage);
          const progressResponse = await api.get(`/progress/${langResponse.data.selectedLanguage.id}`);
          setProgress(progressResponse.data.progress);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedLanguage) {
    return (
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 4, border: '1px solid #d6e4f8', background: 'linear-gradient(160deg, #eef5ff 0%, #ffffff 100%)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, bgcolor: '#1f58b2', fontSize: 34, fontWeight: 800 }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#173a68', mb: 1 }}>
              Welcome to Your Hub
            </Typography>
            <Typography sx={{ color: '#4f678b', mb: 3 }}>
              Choose a realm to unlock quests, learning paths, and arcade progression.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/languages')} sx={{ bgcolor: '#1f58b2', fontWeight: 700, '&:hover': { bgcolor: '#18488f' } }}>
              Choose Realm
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const completedQuests = progress?.completed_tasks_count || 0;
  const totalXp = progress?.total_xp || 0;
  const totalScore = progress?.total_score || 0;
  const completionPercentage = Math.min((completedQuests / 50) * 100, 100);

  const quickActions = [
    { label: 'Quests', sub: 'Continue challenges', icon: <CodeIcon />, onClick: () => navigate(`/tasks/${selectedLanguage.id}`) },
    { label: 'Learning', sub: 'Open track content', icon: <SchoolIcon />, onClick: () => navigate(`/learning/${selectedLanguage.id}`) },
    { label: 'Arcade', sub: 'Unlocked by quest levels', icon: <SportsEsportsIcon />, onClick: () => navigate('/games') },
    { label: 'Realms', sub: 'Switch language', icon: <TrophyIcon />, onClick: () => navigate('/languages') }
  ];

  return (
    <Container maxWidth="lg">
      <Card sx={{ mb: 3, borderRadius: 4, border: '1px solid #d6e4f8', background: 'linear-gradient(155deg, #eef5ff 0%, #ffffff 100%)' }}>
        <CardContent sx={{ p: { xs: 2.4, md: 3.4 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#173a68', mb: 1 }}>
                Hub Overview
              </Typography>
              <Typography sx={{ color: '#4f678b', mb: 2 }}>
                Active realm: <strong>{selectedLanguage.displayName}</strong>. Keep moving through topics and quests to build mastery.
              </Typography>
              <Stack direction="row" spacing={1.2} flexWrap="wrap">
                <Chip icon={<StarIcon />} label={`${totalXp} XP`} sx={{ fontWeight: 700, bgcolor: '#e8f0ff', color: '#1f58b2' }} />
                <Chip icon={<FireIcon />} label={`${completedQuests} Quests`} sx={{ fontWeight: 700, bgcolor: '#e8f6ef', color: '#2f7b47' }} />
                <Chip icon={<TrophyIcon />} label={`${totalScore} Score`} sx={{ fontWeight: 700, bgcolor: '#fff3e8', color: '#b35a10' }} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2.2, borderRadius: 3, backgroundColor: '#ffffff', border: '1px solid #d4e1f5' }}>
                <Typography variant="subtitle2" sx={{ color: '#4f678b', fontWeight: 700 }}>
                  Course Completion
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f58b2', mt: 0.5 }}>
                  {Math.round(completionPercentage)}%
                </Typography>
                <LinearProgress variant="determinate" value={completionPercentage} sx={{ mt: 1.2, height: 8, borderRadius: 5 }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2.2} sx={{ mb: 3 }}>
        {[
          { title: 'Completed Quests', value: completedQuests, color: '#1f58b2' },
          { title: 'Total XP', value: totalXp, color: '#2f7b47' },
          { title: 'Score', value: totalScore, color: '#b35a10' },
          { title: 'Daily Streak', value: 0, color: '#7a43b6' }
        ].map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Card sx={{ borderRadius: 3, border: '1px solid #d8e4f5', backgroundColor: '#fff', height: '100%' }}>
              <CardContent sx={{ minHeight: 112, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: '#6b7f9f', fontWeight: 700 }}>
                  {metric.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: metric.color, mt: 0.6 }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.2}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.label}>
            <Card
              onClick={action.onClick}
              sx={{
                borderRadius: 3,
                border: '1px solid #d8e4f5',
                cursor: 'pointer',
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(20, 53, 103, 0.12)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3, minHeight: 192, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.8 }}>
                <Box sx={{ display: 'inline-grid', placeItems: 'center', width: 50, height: 50, borderRadius: '50%', bgcolor: '#e8f0ff', color: '#1f58b2', mb: 1.2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#163761', lineHeight: 1.2 }}>
                  {action.label}
                </Typography>
                <Typography variant="body2" sx={{ color: '#607798', lineHeight: 1.35, minHeight: 38 }}>
                  {action.sub}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;

