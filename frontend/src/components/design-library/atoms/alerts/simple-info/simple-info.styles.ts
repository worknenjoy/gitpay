import { styled } from '@mui/material/styles'

export const SimpleInfoRoot = styled('div')(({ theme }) => ({
  paddingBottom: 10,
  display: 'flex',
  alignItems: 'center'
}))

export const IconCenter = styled('span')(({ theme }) => ({
  verticalAlign: 'middle',
  paddingRight: 5,
  color: theme.palette.action.active
}))

export const Text = styled('p')(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: 5,
  fontSize: 11,
  marginBottom: 0
}))
