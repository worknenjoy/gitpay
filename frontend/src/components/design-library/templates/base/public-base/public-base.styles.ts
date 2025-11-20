import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'

export const RootContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(6),
}))
