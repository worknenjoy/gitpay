import { styled } from '@mui/material/styles'
import { Card as MuiCard, CardContent as MuiCardContent, Grid as MuiGrid } from '@mui/material'

export const PlanGridItem = styled(MuiGrid)(({ theme }) => ({
  padding: theme.spacing(1),
  marginTop: 16
}))

export const PlanCard = styled(MuiCard)(({ theme }) => ({
  margin: 0,
  padding: 8
}))

export const PlanCardContent = styled(MuiCardContent)(() => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  margin: 0,
  padding: 0
}))

export const PlanButton = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
}))

export const PlanBullets = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  padding: 5
}))

export const PlanIcon = styled('span')(() => ({
  textAlign: 'center',
  fontSize: 32,
  padding: 2
}))

export const CompactCard = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px 4px 6px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.palette.background.paper
}))

export const CompactFee = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
  '& b': {
    display: 'block',
    fontSize: 14,
    lineHeight: 1.2,
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  '& em': {
    display: 'block',
    fontStyle: 'normal',
    fontSize: 11.5,
    lineHeight: 1.2,
    color: theme.palette.text.secondary
  }
}))

export const CompactIcon = styled('span')(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover
}))

export default { PlanGridItem, PlanCard, PlanCardContent, PlanButton, PlanBullets, PlanIcon }
