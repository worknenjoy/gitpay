import { styled } from '@mui/material/styles'
import { Card as MuiCard, Typography as MuiTypography } from '@mui/material'

export const RootCard = styled(MuiCard)(({ theme }) => ({
  maxWidth: 500,
  margin: 10,
  textAlign: 'right',
  padding: 10
}))

export const Balance = styled(MuiTypography)(() => ({
  fontSize: 32,
  fontWeight: 'bold'
}))

export const Name = styled(MuiTypography)(() => ({
  fontSize: 18
}))

export default { RootCard, Balance, Name }
