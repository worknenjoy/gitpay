import { styled } from '@mui/material/styles'
import { Card as MuiCard, Typography as MuiTypography } from '@mui/material'

// See list-card.styles.ts — this app's real text colors, not palette.text.primary/secondary.
const TEXT_PRIMARY = '#353A42'
const TEXT_SECONDARY = '#6e6e6e'

export const RootCard = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(2.25)
}))

export const Title = styled(MuiTypography)(() => ({
  fontSize: 15,
  fontWeight: 500,
  color: TEXT_PRIMARY,
  marginBottom: 14
}))

export const NoteDivider = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(1.75),
  paddingTop: theme.spacing(1.75)
}))

export const Note = styled(MuiTypography)(() => ({
  fontSize: 12.5,
  color: TEXT_SECONDARY,
  lineHeight: 1.5
}))

export const Cta = styled(MuiTypography)(({ theme }) => ({
  display: 'inline-block',
  marginTop: 12,
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.primary.main,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  cursor: 'pointer'
}))
