import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

export const IconWrapper = styled('div')(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0)
}))

export const Message = styled('div')(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(5)
}))
