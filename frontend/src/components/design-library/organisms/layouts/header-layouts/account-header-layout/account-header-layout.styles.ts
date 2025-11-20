import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
  backgroundColor: '#fff',
  padding: '10px 20px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0',
  },
}))

export const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    borderRight: 'none',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
}))

export const Inner = styled('div')(({ theme }) => ({
  marginRight: 10,
  paddingRight: 15,
  borderRight: '1px solid #ccc',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    borderRight: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: 10,
  [theme.breakpoints.down('sm')]: {
    marginTop: 20,
    width: '100%',
  },
}))

export const Account = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
}))
