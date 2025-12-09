import { styled } from '@mui/material/styles'

export const ContentWrapper = styled('div')({
  marginBottom: 40
})

export const CardList = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    display: 'block'
  }
}))
