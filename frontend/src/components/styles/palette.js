import { indigo, teal, grey, green } from '@material-ui/core/colors'

const Palette = {
  palette: {
    primary: {
      light: teal[50],
      main: teal[500],
      dark: teal[700],
      contrastText: grey[100],
      success: green[400]
    },
    secondary: {
      light: indigo[100],
      main: '#000',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
    }
  }
}

export default Palette
