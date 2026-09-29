import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const SimpleInfoRoot = styled('div')(() => ({
  paddingBottom: 10,
  display: 'flex',
  // 'center' vertically centers the icon against the *whole* text block, so it floats
  // between the lines once the text wraps to two or more lines — align to the top and nudge
  // the icon down to the first line instead (see IconCenter's marginTop).
  alignItems: 'center'
}))

export const IconCenter = styled('span')(({ theme }) => ({
  display: 'flex',
  paddingRight: 5,
  color: theme.palette.action.active,
  '& svg': {
    fontSize: 18
  }
}))

// styled(Typography) so this inherits the theme's fontFamily — a plain styled('p')
// falls back to the browser's default serif font, since this app has no global
// CssBaseline/body font-family reset for text elements to inherit from.
export const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 11
}))
