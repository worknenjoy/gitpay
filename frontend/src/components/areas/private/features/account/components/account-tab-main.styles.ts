import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const LegendText = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.primary.dark
}))

export const Fieldset = styled('fieldset')(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  marginBottom: 20
}))
