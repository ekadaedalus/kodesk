import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack
} from '@mui/material';
import { Lock as LockIcon, SportsEsports as GameIcon, Close as CloseIcon } from '@mui/icons-material';
import api from '../services/api';

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games/catalog');
        setGames(response.data.games || []);
      } catch (error) {
        console.error('Error fetching games catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const unlockedCount = games.filter((game) => game.unlocked).length;

  return (
    <Container maxWidth="lg">
      <Card sx={{ borderRadius: 4, border: '1px solid #d6e4f8', background: 'linear-gradient(155deg, #eef5ff 0%, #ffffff 100%)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#173a68', mb: 1 }}>
            Quest Unlock Games
          </Typography>
          <Typography sx={{ color: '#4f678b', mb: 2 }}>
            Complete Quest 1 to unlock Game 1, Quest 2 for Game 2, and continue through all 9 games.
          </Typography>
          <Chip label={`Unlocked ${unlockedCount}/${games.length}`} sx={{ bgcolor: '#e8f0ff', color: '#1f58b2', fontWeight: 700 }} />
        </CardContent>
      </Card>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2.2}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: game.unlocked ? '1px solid #b8d2f2' : '1px solid #dbe5f4',
                  backgroundColor: game.unlocked ? '#ffffff' : '#f8fafc',
                  opacity: game.unlocked ? 1 : 0.75,
                  height: '100%'
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                    <Chip size="small" label={`Quest ${game.required_level}`} sx={{ fontWeight: 700 }} />
                    {game.unlocked ? <GameIcon sx={{ color: '#1f58b2' }} /> : <LockIcon sx={{ color: '#7a8ea8' }} />}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#163761', mb: 0.8 }}>
                    {game.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#607798', flex: 1, mb: 2 }}>
                    {game.description}
                  </Typography>
                  <Button
                    variant={game.unlocked ? 'contained' : 'outlined'}
                    disabled={!game.unlocked}
                    onClick={() =>
                      setActiveGame({
                        ...game,
                        play_url: `${game.play_url}${game.play_url.includes('?') ? '&' : '?'}v=${Date.now()}`
                      })
                    }
                    sx={{
                      fontWeight: 700,
                      ...(game.unlocked
                        ? { bgcolor: '#1f58b2', '&:hover': { bgcolor: '#18488f' } }
                        : { borderColor: '#9db2d1', color: '#7a8ea8' })
                    }}
                  >
                    {game.unlocked ? 'Play' : 'Locked'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!activeGame}
        onClose={() => setActiveGame(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
      >
        {activeGame && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800 }}>{activeGame.title}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => window.open(activeGame.play_url, '_blank', 'noopener,noreferrer')}
                >
                  Open Tab
                </Button>
                <IconButton onClick={() => setActiveGame(null)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ width: '100%', height: '75vh', borderTop: '1px solid #dce6f4' }}>
                <iframe
                  title={activeGame.title}
                  src={activeGame.play_url}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; fullscreen; gamepad; microphone"
                />
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default Games;
