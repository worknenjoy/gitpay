import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const SimpleInfoRoot = styled('div')(({ theme }) => ({
  paddingBottom: 10,
  display: 'flex',
  alignItems: 'center'
}))

export const IconCenter = styled('span')(({ theme }) => ({
  verticalAlign: 'middle',
  paddingRight: 5,
  color: theme.palette.action.active
}))

// styled(Typography) so this inherits the theme's fontFamily — a plain styled('p')
// falls back to the browser's default serif font, since this app has no global
// CssBaseline/body font-family reset for text elements to inherit from.
export const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: 5,
  fontSize: 11,
  marginBottom: 0
}))
