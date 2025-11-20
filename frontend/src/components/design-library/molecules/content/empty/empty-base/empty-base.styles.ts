import { Typography } from '@mui/material'
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
  backgroundColor: theme.palette.background.paper,
}))

export const Message = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

export const MessageSecondary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0),
  marginTop: theme.spacing(0),
}))

export const IconContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(0),
  fontSize: 72,
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: 'inherit',
  },
}))
