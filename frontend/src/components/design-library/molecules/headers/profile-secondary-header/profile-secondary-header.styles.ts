import { styled } from '@mui/material/styles'

export const Container = styled('div')(({ theme }) => ({
  marginBottom: 20,
  paddingBottom: 20,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderBottom: '1px solid #e2e5ea'
}))
