import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Shell = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(10)
}))
