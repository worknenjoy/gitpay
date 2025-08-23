import { styled } from '@mui/material/styles'

export const RightActions = styled('div')(({ theme }) => ({
  marginTop: 20,
  display: 'flex',
  justifyContent: 'flex-end'
}))

export const AutomaticOptions = styled('div')(({ theme }) => ({
  width: 400,
  '& .MuiTypography-caption': {
    marginTop: 20
  }
}))
