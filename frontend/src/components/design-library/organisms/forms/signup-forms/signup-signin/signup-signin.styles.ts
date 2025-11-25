import { styled } from '@mui/material/styles'

export const SecondaryActionsContainerStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginRight: 20,
  [theme.breakpoints.down('sm')]: {
    marginTop: 10,
    marginRight: 0,
    width: '100%',
    justifyContent: 'center'
  }
}))
