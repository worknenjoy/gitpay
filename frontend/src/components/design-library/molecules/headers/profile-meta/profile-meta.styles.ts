import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(1.5)
}))

export const Line = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: 13
}))

export const Sep = styled('span')(({ theme }) => ({
  width: 3,
  height: 3,
  borderRadius: '50%',
  backgroundColor: theme.palette.text.disabled,
  display: 'inline-block'
}))

export const Chip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: '3px 10px',
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  fontSize: 12.5
}))

export const Dot = styled('span', {
  shouldForwardProp: (prop) => prop !== '$warn'
})<{ $warn?: boolean }>(({ theme, $warn }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: $warn ? theme.palette.warning.main : theme.palette.success.main,
  display: 'inline-block'
}))
