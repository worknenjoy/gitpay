import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const CountryContainer = styled('div')(({ theme }) => ({
  padding: 20,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const CountryItem = styled(Button)(({ theme }) => ({
  display: 'inline-block',
  textAlign: 'center',
  padding: 25,
  [theme.breakpoints.down('sm')]: {
    padding: 10,
    margin: 8,
    width: '100%',
    maxWidth: 200,
    boxSizing: 'border-box',
    flex: '1 1 100%',
    minWidth: 0,
    fontSize: '0.8rem',
  },
}))

export const FullWidthMobile = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    padding: 12,
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.7rem',
  },
}))

export const CreditTextMobile = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    order: 3,
  },
}))

export const ButtonPrimaryMobile = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: 1,
  },
}))

export const ButtonSecondaryMobile = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: 2,
    marginTop: 8,
    marginBottom: 8,
  },
}))

export default {
  CountryContainer,
  CountryItem,
  FullWidthMobile,
  CreditTextMobile,
  ButtonPrimaryMobile,
  ButtonSecondaryMobile,
}
