import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Games as GamesIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Logout as LogoutIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 86;

const menuItems = [
  { text: 'Hub', icon: <DashboardIcon />, path: '/hub' },
  { text: 'Realms', icon: <LanguageIcon />, path: '/languages' },
  { text: 'Learning', icon: <SchoolIcon />, path: '/learning' },
  { text: 'Quests', icon: <CodeIcon />, path: '/tasks' },
  { text: 'Arcade', icon: <GamesIcon />, path: '/games' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' }
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [stats, setStats] = useState({ xp: 0, pts: 0, day: 0 });
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchShellStats = async () => {
      try {
        const langResponse = await api.get('/languages/user/selected');
        const languageId = langResponse.data?.selectedLanguage?.id;
        if (!languageId) return;
        setSelectedLanguage(languageId);
        const progressResponse = await api.get(`/progress/${languageId}`);
        const progress = progressResponse.data?.progress || {};
        setStats({
          xp: progress.total_xp || 0,
          pts: progress.total_score || 0,
          day: progress.current_streak || progress.streak_days || 0
        });
      } catch (error) {
        console.error('Failed to fetch layout stats:', error);
      }
    };
    fetchShellStats();
  }, [location.pathname]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDesktopToggle = () => setDesktopCollapsed((prev) => !prev);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const desktopDrawerWidth = desktopCollapsed ? drawerWidthCollapsed : drawerWidthExpanded;

  const renderMenuList = (collapsed = false, onNavigate = () => {}) => (
    <List sx={{ mt: 1.5, px: collapsed ? 1 : 1.2 }}>
      {menuItems.map((item) => {
        const targetPath = item.path === '/tasks' && selectedLanguage ? `/tasks/${selectedLanguage}` : item.path;
        const selected = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        const itemButton = (
          <ListItemButton
            selected={selected}
            onClick={() => onNavigate(targetPath)}
            sx={{
              my: 0.5,
              borderRadius: 2,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: collapsed ? 1 : 1.4,
              color: '#e4eeff',
              '& .MuiListItemIcon-root': {
                minWidth: collapsed ? 0 : 40,
                color: selected ? '#6cf2ff' : '#c7d7f0'
              },
              '& .MuiListItemText-primary': {
                fontWeight: selected ? 800 : 600,
                color: selected ? '#8ff7ff' : '#d5e3f8',
                letterSpacing: '0.01em'
              },
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.26), rgba(67, 108, 255, 0.23))',
                border: '1px solid rgba(125, 236, 255, 0.5)'
              },
              '&:hover': {
                backgroundColor: 'rgba(109, 178, 255, 0.16)'
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {!collapsed && <ListItemText primary={item.text} />}
          </ListItemButton>
        );

        return (
          <ListItem key={item.text} disablePadding>
            {collapsed ? <Tooltip title={item.text} placement="right">{itemButton}</Tooltip> : itemButton}
          </ListItem>
        );
      })}
    </List>
  );

  const mobileDrawer = (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: drawerWidthExpanded,
          background: 'linear-gradient(180deg, #131f3b 0%, #1b2a4f 100%)',
          color: '#dce9ff',
          borderRight: '1px solid rgba(137, 191, 255, 0.3)'
        }
      }}
    >
      <Box sx={{ p: 2.2, borderBottom: '1px solid rgba(137, 191, 255, 0.25)' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#76f6ff', letterSpacing: '0.15em' }}>KODESK</Typography>
        <Typography sx={{ color: '#9db3d5', fontSize: 13, mt: 0.3 }}>Code Quest Arena</Typography>
      </Box>
      {renderMenuList(false, (path) => {
        navigate(path);
        setMobileOpen(false);
      })}
    </Drawer>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#07122a' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: desktopDrawerWidth,
          transition: 'width 0.22s ease',
          background: 'linear-gradient(180deg, #152243 0%, #1f2b50 100%)',
          borderRight: '1px solid rgba(137, 191, 255, 0.25)',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1200
        }}
      >
        <Box sx={{ px: desktopCollapsed ? 1.2 : 2.2, py: 2, borderBottom: '1px solid rgba(137, 191, 255, 0.25)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: desktopCollapsed ? 'center' : 'space-between', gap: 1 }}>
            {!desktopCollapsed && (
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#76f6ff', letterSpacing: '0.15em' }}>KODESK</Typography>
                <Typography sx={{ color: '#9db3d5', fontSize: 13, mt: 0.2 }}>Code Quest Arena</Typography>
              </Box>
            )}
            <IconButton onClick={handleDesktopToggle} sx={{ color: '#c8d8f1' }}>
              {desktopCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>
        </Box>

        {renderMenuList(desktopCollapsed, (path) => navigate(path))}

        {!desktopCollapsed && (
          <>
            <Divider sx={{ my: 1.6, borderColor: 'rgba(137, 191, 255, 0.25)' }} />
            <Box sx={{ px: 2.2 }}>
              <Typography sx={{ color: '#67c9ff', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', mb: 1.2 }}>
                PLAYER STATS
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, mb: 1.4 }}>
                <Avatar sx={{ width: 42, height: 42, bgcolor: '#27f08f', color: '#03211a', fontWeight: 800 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: '#d9ebff', fontWeight: 700, lineHeight: 1.2 }}>{user?.username}</Typography>
                  <Typography sx={{ color: '#9db3d5', fontSize: 12 }}>Level 1 Pioneer</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(58, 99, 153, 0.34)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.9 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><StarIcon sx={{ fontSize: 16, color: '#76f6ff' }} /><Typography sx={{ color: '#bfd3ef', fontSize: 13 }}>XP</Typography></Box>
                <Typography sx={{ color: '#76f6ff', fontWeight: 800, fontSize: 13 }}>{stats.xp}</Typography>
              </Box>
              <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(94, 69, 127, 0.34)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><TrophyIcon sx={{ fontSize: 16, color: '#ff7bc2' }} /><Typography sx={{ color: '#bfd3ef', fontSize: 13 }}>Score</Typography></Box>
                <Typography sx={{ color: '#ff7bc2', fontWeight: 800, fontSize: 13 }}>{stats.pts}</Typography>
              </Box>
            </Box>
          </>
        )}

        <Box sx={{ p: 2, mt: 'auto' }} />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: { xs: 0, md: `${desktopDrawerWidth}px` }, transition: 'margin-left 0.22s ease' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(11, 23, 49, 0.96)',
            borderBottom: '1px solid rgba(128, 189, 255, 0.22)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <Toolbar sx={{ minHeight: 70 }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1.2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, letterSpacing: '0.2em', color: '#8df7ff', fontSize: 15 }}>QUESTING</Typography>
              <Typography sx={{ color: '#92a8c8', fontSize: 13 }}>Embrace the Code</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mr: 1.2 }}>
              <Chip icon={<StarIcon sx={{ color: '#76f6ff !important' }} />} label={`${stats.xp} XP`} sx={{ color: '#88f8ff', bgcolor: 'rgba(44, 80, 124, 0.52)', border: '1px solid rgba(118, 246, 255, 0.35)', fontWeight: 700 }} />
              <Chip icon={<TrophyIcon sx={{ color: '#6eff95 !important' }} />} label={`${stats.pts} PTS`} sx={{ color: '#8effaf', bgcolor: 'rgba(44, 80, 124, 0.52)', border: '1px solid rgba(110, 255, 149, 0.35)', fontWeight: 700 }} />
              <Chip icon={<FireIcon sx={{ color: '#53d2ff !important' }} />} label={`${stats.day} DAY`} sx={{ color: '#7bdfff', bgcolor: 'rgba(44, 80, 124, 0.52)', border: '1px solid rgba(83, 210, 255, 0.35)', fontWeight: 700 }} />
            </Box>

            <Tooltip title={user?.username || ''}>
              <Avatar
                onClick={() => navigate('/profile')}
                sx={{ bgcolor: '#27f08f', color: '#03211a', fontWeight: 900, cursor: 'pointer', width: 38, height: 38 }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </Tooltip>
            <IconButton
              onClick={handleLogout}
              sx={{
                ml: 0.6,
                color: '#ff7c9a',
                '&:hover': { color: '#ff99b2', backgroundColor: 'rgba(255, 124, 154, 0.14)' }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {mobileDrawer}

        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 1.2, sm: 2, md: 2.6 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;

