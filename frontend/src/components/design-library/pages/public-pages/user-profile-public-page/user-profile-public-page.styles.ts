import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Grid)(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))
