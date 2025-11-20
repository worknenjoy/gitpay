import { styled } from '@mui/material/styles'
import { Card, CardMedia } from '@mui/material'

export const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
}))

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  flexFlow: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))

export const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  minWidth: 350,
  [theme.breakpoints.down('sm')]: {
    minWidth: 0,
  },
  margin: 40,
}))

export const Media = styled(CardMedia)(({ theme }) => ({
  height: 220,
}))
