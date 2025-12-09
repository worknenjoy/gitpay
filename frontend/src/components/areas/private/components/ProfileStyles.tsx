import { Card as BaseCard, CardMedia as BaseCardMedia } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Card = styled(BaseCard)(({ theme }) => ({
  maxWidth: 280,
  margin: '1rem 0.5rem',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    margin: '1.5rem 0'
  }
}))

export const CardList = styled('div')(({ theme }) => ({
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  marginTop: 40,
  justifyContent: 'center',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    display: 'block'
  }
}))

export const CardMedia = styled(BaseCardMedia)({
  width: 48,
  height: 60,
  marginTop: 20,
  marginBottom: -10,
  display: 'inline-block !important'
})
