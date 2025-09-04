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

export default { PlanGridItem, PlanCard, PlanCardContent, PlanButton, PlanBullets, PlanIcon }
