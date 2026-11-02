import { createTheme } from '@mui/material/styles';

// Neon color palette
const colors = {
  primary: '#00D9FF',      // Cyan
  secondary: '#FF006E',    // Magenta
  accent: '#39FF14',       // Lime Green
  dark: '#0A0E27',         // Deep space
  surface: '#1A1F3A',      // Dark surface
  surfaceLight: '#262D42', // Slightly lighter surface
  success: '#00FF88',      // Neon green
  warning: '#FFD700',      // Gold
  error: '#FF1744',        // Red
  text: '#E0E0E0',         // Light text
  textDark: '#0A0E27',     // Dark text for light backgrounds
};

const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      light: '#00FFFF',
      dark: '#00A8CC',
    },
    secondary: {
      main: colors.secondary,
      light: '#FF1493',
      dark: '#C2004A',
    },
    background: {
      default: colors.dark,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
      secondary: '#B0B0B0',
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-2px',
      textShadow: `0 0 20px ${colors.primary}80`,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-1px',
      textShadow: `0 0 15px ${colors.primary}60`,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.8rem',
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.4rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    code: {
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.85rem',
      backgroundColor: colors.surfaceLight,
      padding: '2px 6px',
      borderRadius: '4px',
    },
  },
  components: {
    // Button styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
            transition: 'left 0.5s',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 0 20px ${colors.primary}60, inset 0 0 20px ${colors.primary}20`,
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          color: colors.textDark,
          fontWeight: 700,
          border: `2px solid ${colors.primary}`,
          boxShadow: `0 0 10px ${colors.primary}40`,
          '&:hover': {
            boxShadow: `0 0 30px ${colors.primary}80, inset 0 0 20px ${colors.primary}40`,
          },
        },
        outlined: {
          borderColor: colors.primary,
          color: colors.primary,
          border: `2px solid ${colors.primary}`,
          boxShadow: `inset 0 0 10px ${colors.primary}20`,
          '&:hover': {
            backgroundColor: `${colors.primary}15`,
            boxShadow: `inset 0 0 20px ${colors.primary}40, 0 0 20px ${colors.primary}40`,
          },
        },
        text: {
          color: colors.primary,
          '&:hover': {
            backgroundColor: `${colors.primary}10`,
          },
        },
      },
    },
    // Card styling
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.surface}FF 0%, ${colors.surfaceLight}FF 100%)`,
          border: `1px solid ${colors.primary}40`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 20px ${colors.primary}30, inset 0 0 20px ${colors.primary}10`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 0 40px ${colors.primary}60, inset 0 0 20px ${colors.primary}20`,
            borderColor: colors.primary,
          },
        },
      },
    },
    // AppBar styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.surface}E6 0%, ${colors.surfaceLight}E6 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.primary}40`,
          boxShadow: `0 0 30px ${colors.primary}40, inset 0 0 30px ${colors.primary}10`,
        },
      },
    },
    // TextField styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            color: colors.text,
            backgroundColor: `${colors.surfaceLight}40`,
            transition: 'all 0.3s',
            border: `1px solid ${colors.primary}40`,
            '&:hover': {
              borderColor: colors.primary,
              boxShadow: `inset 0 0 10px ${colors.primary}20`,
            },
            '&.Mui-focused': {
              borderColor: colors.primary,
              boxShadow: `0 0 20px ${colors.primary}60, inset 0 0 10px ${colors.primary}30`,
              backgroundColor: `${colors.surfaceLight}60`,
            },
          },
          '& .MuiOutlinedInput-input': {
            color: colors.text,
            '&::placeholder': {
              color: '#888',
              opacity: 0.7,
            },
          },
          '& .MuiInputBase-input': {
            fontFamily: "'Poppins', sans-serif",
          },
        },
      },
    },
    // Chip styling
    MuiChip: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}30)`,
          border: `1px solid ${colors.primary}60`,
          color: colors.primary,
          fontWeight: 600,
          '&:hover': {
            boxShadow: `0 0 15px ${colors.primary}60`,
          },
        },
      },
    },
    // LinearProgress styling
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          backgroundColor: `${colors.surfaceLight}80`,
          border: `1px solid ${colors.primary}40`,
          overflow: 'hidden',
          boxShadow: `inset 0 0 10px ${colors.primary}20`,
        },
        bar: {
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
          boxShadow: `0 0 10px ${colors.primary}80`,
          borderRadius: '10px',
        },
      },
    },
    // Dialog styling
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(135deg, ${colors.surface}F2 0%, ${colors.surfaceLight}F2 100%)`,
          border: `1px solid ${colors.primary}40`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 50px ${colors.primary}60, inset 0 0 30px ${colors.primary}10`,
          borderRadius: '16px',
        },
      },
    },
    // Paper styling
    MuiPaper: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.surface}F0 0%, ${colors.surfaceLight}F0 100%)`,
          border: `1px solid ${colors.primary}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 20px ${colors.primary}30, inset 0 0 15px ${colors.primary}08`,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

// Global animation styles
export const globalAnimations = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 10px ${colors.primary}80, 0 0 20px ${colors.primary}60;
    }
    50% {
      text-shadow: 0 0 20px ${colors.primary}FF, 0 0 40px ${colors.primary}80;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 10px ${colors.primary}60;
    }
    50% {
      box-shadow: 0 0 30px ${colors.primary}FF;
    }
  }

  @keyframes particle-rise {
    0% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) translateX(50px) scale(0);
      opacity: 0;
    }
  }

  @keyframes success-bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes error-shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  body {
    background: linear-gradient(135deg, ${colors.dark} 0%, #0F1336 100%);
    color: ${colors.text};
    font-family: 'Poppins', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${colors.primary}, ${colors.accent});
    border-radius: 10px;
    box-shadow: 0 0 10px ${colors.primary}60;
  }

  ::-webkit-scrollbar-thumb:hover {
    box-shadow: 0 0 20px ${colors.primary}80;
  }
`;

export default modernTheme;
export { colors };
