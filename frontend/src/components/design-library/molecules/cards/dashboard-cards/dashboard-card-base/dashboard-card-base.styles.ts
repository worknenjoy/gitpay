import { styled } from '@mui/material/styles'
import { Card as BaseCard, CardMedia as BaseCardMedia, CardActions } from '@mui/material'

export const CardActionsCentered = styled(CardActions)({
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'center'
})

export const Card = styled(BaseCard)(({ theme }) => ({
  width: 352,
  margin: '1rem 0.5rem',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    margin: '1.5rem 0'
  }
}))

export const CardMedia = styled(BaseCardMedia)({})
