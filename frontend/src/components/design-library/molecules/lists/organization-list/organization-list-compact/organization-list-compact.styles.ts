import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

export const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
}))

export const RootCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  marginRight: 20,
}))

export const Item = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  marginRight: theme.spacing(3),
}))
