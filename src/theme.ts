import { createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(19,62,135)',
      light: 'rgb(19,62,135)',
      dark: 'rgb(19,62,135)'
    },
    secondary: {
      main: 'rgb(37,37,37)',
      light: 'rgb(37,37,37)',
      dark: 'rgb(37,37,37)'
    },
    background: {
      default: 'rgb(255,255,255)',
      paper: 'rgb(255,255,255)'
    },
    text: {
      primary: 'rgb(28,27,31)',
      secondary: 'rgb(37,37,37)'
    },
    error: {
      main: 'rgb(251,49,49)'
    },
    success: {
      main: 'rgb(1,166,1)'
    },
    info: {
      main: 'rgb(1, 87, 155)'
    },
    warning: {
      main: 'rgb(251,49,49)'
    }
  },
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 600
    },
    h3: {
      fontWeight: 600
    },
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            '&:hover': {
              backgroundColor: 'rgba(19, 62, 135, 0.08)'
            }
          }
        }
      }
    }
  }
})

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(19,62,135)',
      light: 'rgb(19,62,135)',
      dark: 'rgb(19,62,135)'
    },
    secondary: {
      main: 'rgb(204,194,220)',
      light: 'rgb(204,194,220)',
      dark: 'rgb(204,194,220)'
    },
    background: {
      default: 'rgb(11,15,26)',
      paper: 'rgb(11,15,26)'
    },
    text: {
      primary: 'rgb(230,225,229)',
      secondary: 'rgb(202,196,208)'
    },
    error: {
      main: 'rgb(255,77,79)'
    },
    success: {
      main: 'rgb(83,202,23)'
    },
    info: {
      main: 'rgb(71,172,251)'
    },
    warning: {
      main: 'rgb(250,173,20)'
    }
  },
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 600
    },
    h3: {
      fontWeight: 600
    },
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgb(28,27,31)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            '&:hover': {
              backgroundColor: 'rgba(208, 188, 255, 0.16)'
            }
          }
        }
      }
    }
  }
})
