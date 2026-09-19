import { styled } from '@mui/material/styles'
import { Card as MuiCard } from '@mui/material'

export const RootCard = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(2.25)
}))

export const ProgressWrap = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2)
}))

export const List = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}))
