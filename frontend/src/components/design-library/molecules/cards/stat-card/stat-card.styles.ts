import { styled } from '@mui/material/styles'
import { Card as MuiCard, Typography as MuiTypography } from '@mui/material'

// This app's real text colors — palette.js only customizes these per
// Typography variant (h3-h6/subtitle/caption), not palette.text.primary/
// secondary, so components styling raw Typography by color must reference
// the actual values directly instead of falling back to MUI's near-black
// defaults.
const TEXT_PRIMARY = '#353A42'
const TEXT_SECONDARY = '#6e6e6e'

export const RootCard = styled(MuiCard)(() => ({
  maxWidth: 500,
  margin: 10,
  textAlign: 'right',
  padding: 10
}))

export const Header = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 6,
  marginBottom: 4
}))

export const IconWrap = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: theme.palette.primary.main,
  '& svg': {
    display: 'block',
    fontSize: 16
  }
}))

export const Label = styled(MuiTypography)(() => ({
  fontSize: 13,
  lineHeight: 1.3,
  color: TEXT_SECONDARY
}))

export const ValueRow = styled('div')(() => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'flex-end',
  gap: 2
}))

export const CurrencyPrefix = styled(MuiTypography)(() => ({
  fontSize: 18,
  color: TEXT_SECONDARY
}))

export const Value = styled(MuiTypography)(() => ({
  fontSize: 32,
  fontWeight: 'bold',
  color: TEXT_PRIMARY
}))

export const Note = styled(MuiTypography)(() => ({
  fontSize: 12.5,
  color: TEXT_SECONDARY,
  marginTop: 4
}))
