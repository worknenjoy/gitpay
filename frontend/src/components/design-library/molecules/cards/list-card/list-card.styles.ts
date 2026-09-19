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
  overflow: 'hidden'
}))

export const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  padding: theme.spacing(1.75, 2.25),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

export const HeaderText = styled('div')({
  minWidth: 0
})

export const Title = styled(MuiTypography)(() => ({
  fontSize: 15,
  fontWeight: 500,
  color: TEXT_PRIMARY
}))

export const Subtitle = styled(MuiTypography)(() => ({
  fontSize: 12.5,
  color: TEXT_SECONDARY,
  marginTop: 3
}))

export const HeaderLink = styled(MuiTypography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.primary.main,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  cursor: 'pointer'
}))

export const Body = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2.25, 0.5)
}))

export const Footer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2.25),
  display: 'flex',
  justifyContent: 'center'
}))

export const FooterLink = styled(MuiTypography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

export const EmptyRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  textAlign: 'center',
  padding: theme.spacing(5.75, 3)
}))

export const EmptyIconBadge = styled('span')(({ theme }) => ({
  width: 38,
  height: 38,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
  color: TEXT_SECONDARY
}))

export const EmptyText = styled(MuiTypography)(() => ({
  fontSize: 13,
  color: TEXT_SECONDARY,
  maxWidth: 320
}))

export const SkeletonRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: theme.spacing(1.75, 0)
}))

export const SkeletonRowRight = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 14
})
