import { Card, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

export const RootCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}))

export const StatsItem = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
}))
