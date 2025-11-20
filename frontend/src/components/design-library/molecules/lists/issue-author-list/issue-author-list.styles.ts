import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  flexGrow: 1
}))

export const MainBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2)
}))
