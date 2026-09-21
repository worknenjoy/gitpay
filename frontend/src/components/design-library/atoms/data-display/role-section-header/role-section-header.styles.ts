import { styled } from '@mui/material/styles'
import { Typography as MuiTypography } from '@mui/material'

// See list-card.styles.ts — this app's real text colors, not palette.text.primary/secondary.
const TEXT_PRIMARY = '#353A42'
const TEXT_SECONDARY = '#6e6e6e'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25)
}))

export const IconBadge = styled('span')(({ theme }) => ({
  flexShrink: 0,
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
  color: TEXT_PRIMARY
}))

export const Text = styled('div')({
  minWidth: 0,
  flex: 1
})

export const Label = styled(MuiTypography)(() => ({
  fontSize: 15,
  fontWeight: 600,
  color: TEXT_PRIMARY
}))

export const Sub = styled(MuiTypography)(() => ({
  fontSize: 12.5,
  color: TEXT_SECONDARY,
  marginTop: 1
}))

export const Link = styled(MuiTypography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.primary.main,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  cursor: 'pointer'
}))
