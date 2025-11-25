import { styled } from '@mui/material/styles'

export const ProfileHeaderContainer = styled('div')(({ theme }) => ({
  marginBottom: 20,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}))
