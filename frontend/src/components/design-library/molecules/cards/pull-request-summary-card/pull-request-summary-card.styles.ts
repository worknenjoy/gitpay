import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.75, 2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1)
}))

export const IconWrap = styled('span')(({ theme }) => ({
  flexShrink: 0,
  width: 28,
  height: 28,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.success.light ?? theme.palette.success.main,
  color: theme.palette.success.dark ?? theme.palette.success.contrastText,
  '& svg': { fontSize: 15 }
}))

export const Body = styled('div')(() => ({
  flex: 1,
  minWidth: 0
}))

export const Meta = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: 11.5,
  color: theme.palette.text.secondary
}))

export const Title = styled(Typography)(({ theme }) => ({
  marginTop: 3,
  fontSize: 14,
  color: theme.palette.text.primary,
  lineHeight: 1.4
}))
