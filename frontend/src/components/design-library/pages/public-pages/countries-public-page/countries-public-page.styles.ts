import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'

export const Layout = styled('div')(({ theme }) => ({
  width: 'auto',
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up(1200)]: {
    width: 1200,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))

export const HeroContent = styled('div')(({ theme }) => ({
  maxWidth: 700,
  margin: '0 auto',
  padding: `${theme.spacing(4)} 0 ${theme.spacing(2)}`,
  textAlign: 'center'
}))

export const CountryCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  height: '100%',
  cursor: 'default',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
    transform: 'translateY(-2px)'
  }
}))

export const FlagImage = styled('img')({
  width: 56,
  height: 'auto',
  marginBottom: 8,
  borderRadius: 2
})

export const CountryName = styled('div')(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.85rem',
  textAlign: 'center',
  color: theme.palette.text.primary,
  lineHeight: 1.3
}))

export const CurrencyLabel = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginTop: 2
}))
