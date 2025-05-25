import { grey, green } from '@material-ui/core/colors'
import { divide } from 'lodash'

const Palette = {
  typography: {
    fontFamily: ['Roboto', 'Inter', 'Helvetica', ],
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
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 400,
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
      success: green[400],
      error: '#FF0000'
    },
    secondary: {
      light: '#d0722a',
      main: '#d0722a',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
    }
  },
  overrides: {
    // Name of the component
    MuiDrawer: {
      
        root: {
          // Some CSS
          
        },
        paper: {
          // Some CSS
          width: 700
        }
      
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#4D7E6F',
      },
      root: {
        backgroundColor: '#4D7E6F',
      }
    },
    MuiTabs: {
      root: {
        background: 'transparent'
        // color: '#000'
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        minWidth: '72px !important',
        padding: 0,
        margin: '0 24px 0 0',
      }
    },
    MuiTableCell: {
      root: {
        padding: '8px 16px',
      }
    },
    MuiMenuItem: {
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
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32
      }
    },
    MuiButtonBase: {
      root: {
        textTransform: 'none',
        whiteSpace: 'nowrap',
      }
    },
    MuiButton: {
      root: {
        borderRadius: '18px',
        textTransform: 'none',
        fontSize: 16,
        color: '#353A42',
        '&:hover': {
          backgroundColor: '#E2E5EA'
        }
      },
      contained: {
        boxShadow: 'none',
        textTransform: 'none',
      },
      primary: {
        color: '#fff',
        backgroundColor: '#4D7E6F'
      }
    },
    MuiButtonGroup: {
      contained: {
        boxShadow: 'none'
      }
    },
    MuiInput: {
      root: {
        margin: '2px 0'
      },
      input: {
        border: '2px solid #E2E5EA',
        borderRadius: '3px',
        padding: '0px 12px',
        height: 52,
        '&:focus': {
          border: '2px solid #353A42'
        },
      },
      underline: {
        '&:before': {
          borderBottom: 'none'
        },
        '&:after': {
          borderBottom: 'none'
        },
        '&:hover:not(.Mui-disabled):before': {
          borderBottom: 'none',
        },
      }
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: '#353A42',
        },
      }
    },
    MuiInputLabel: {
      root: {
        color: '#929292',
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        padding: 2,
        zIndex: 200
      },
      outlined: {
        margin: 0,
        padding: 0
      },
    },
  }
}

export default Palette
