import { indigo, teal, grey, green } from '@material-ui/core/colors'

const Palette = {
  typography: {
    fontFamily: ['Inter', 'Helvetica', 'Roboto']
  },
  palette: {
    primary: {
      light: '#E2E5EA',
      main: teal[500],
      dark: '#353A42',
      contrastText: grey[100],
      success: green[400],
      error: '#FF0000'
    },
    secondary: {
      light: indigo[100],
      main: '#000',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
    },
  },
  overrides: {
    /*
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
        backgroundColor: 'transparent',
        color: '#000'
      }
    }, */
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
