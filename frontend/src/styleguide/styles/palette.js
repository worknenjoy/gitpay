import { grey, green } from '@mui/material/colors'

const Palette = {
  typography: {
    fontFamily: 'Roboto, Inter, Helvetica, Arial, sans-serif',
    h3: {
      fontWeight: 200,
      fontSize: 42,
      lineHeight: '52px',
      color: '#353A42'
    },
    h4: {
      fontWeight: 200,
      fontSize: 28,
      lineHeight: '24px',
      color: '#353A42'
    },
    h5: {
      fontWeight: 500,
      fontSize: 28,
      lineHeight: '28px',
      color: '#353A42'
    },
    h6: {
      fontWeight: 400,
      fontSize: 21,
      lineHeight: '20px',
      color: '#353A42'
    },
    body1: {
      fontSize: 14
    },
    caption: {
      fontSize: 12,
      color: '#9B9B9B'
    },
    subtitle1: {
      fontWeight: 500
    },
    subtitle2: {
      fontWeight: 400
    }
  },
  palette: {
    /*
    action: {
      selected: '#E7A615',
      hover: '#FFD371',
      disabled: '#9B9B9B'
    },
    */
    primary: {
      light: '#E2E5EA',
      main: '#2c5c46',
      dark: '#353A42',
      contrastText: grey[100],
      // keep these custom keys for backward compatibility with usages like theme.palette.primary.success
      success: green[400],
      error: '#FF0000'
    },
    secondary: {
      light: '#d0722a',
      main: '#d0722a',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff'
    },
    // MUI v5+ expects success/error at the top-level palette as well
    success: {
      main: green[400]
    },
    error: {
      main: '#FF0000'
    }
  },
  components: {
    // Name of the component
    MuiDrawer: {
      styleOverrides: {
        root: {
          // Some CSS
        },
        paper: {
          // Some CSS
          width: 700
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#4D7E6F'
        }
        /*
        root: {
          backgroundColor: '#4D7E6F'
        }
        */
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          background: 'transparent'
          // color: '#000'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 72,
          padding: 0,
          margin: '0 24px 0 0'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 0 8px 16px'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          /*
          '&:hover': {
            borderRadius: 8,
          },
          '&:focus': {
            backgroundColor: '#E2E5EA',
            borderRadius: 8,
            // color: 'white'
          }
          */
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          whiteSpace: 'nowrap'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '18px',
          textTransform: 'none',
          fontSize: 16,
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiButtonGroup: {
      styleOverrides: {
        contained: {
          boxShadow: 'none'
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          margin: '2px 0'
        },
        input: {
          border: '2px solid #E2E5EA',
          borderRadius: '3px',
          padding: '0px 12px',
          height: 52,
          zIndex: 1,
          '&:focus': {
            border: '2px solid #353A42'
          }
        },
        underline: {
          '&:before': {
            borderBottom: 'none'
          },
          '&:after': {
            borderBottom: 'none'
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: 'none'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#929292',
          marginTop: 10,
          marginLeft: 10,
          backgroundColor: 'white',
          padding: 2,
          zIndex: 2
        },
        outlined: {
          margin: 0,
          padding: 0
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#353A42'
          }
        }
      }
    }
  }
}

export default Palette
