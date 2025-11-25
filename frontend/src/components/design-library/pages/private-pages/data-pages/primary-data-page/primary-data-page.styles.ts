import { styled } from '@mui/material/styles'

export const CardsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    border: '1px solid red'
  }
}))
