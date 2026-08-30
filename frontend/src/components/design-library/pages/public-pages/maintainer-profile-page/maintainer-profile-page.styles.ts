import { Box, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Grid)(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))

export const StatsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2)
}))
