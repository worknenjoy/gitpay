import { styled } from '@mui/material/styles'

export const Layout = styled('div')(({ theme }) => ({
  width: 'auto',
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up(900)]: {
    width: 900,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))

export const HeroContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: `${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
  marginTop: theme.spacing(3),
  marginBottom: 0
}))

export const CardPricing = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'baseline',
  marginBottom: theme.spacing(2)
}))
