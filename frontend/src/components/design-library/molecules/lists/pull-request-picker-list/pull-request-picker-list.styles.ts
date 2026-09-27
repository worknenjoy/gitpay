import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}))

export const ScopeRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1.5)
}))

export const List = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  overflow: 'hidden'
}))

export const Row = styled('button')(({ theme }) => ({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': { backgroundColor: theme.palette.action.hover },
  '&[data-selected="true"]': { backgroundColor: theme.palette.primary.light }
}))

export const RadioDot = styled('span')(({ theme }) => ({
  flexShrink: 0,
  marginTop: 5,
  width: 16,
  height: 16,
  borderRadius: '50%',
  boxSizing: 'border-box',
  border: `2px solid ${theme.palette.text.disabled}`,
  '[data-selected="true"] &': {
    borderColor: theme.palette.primary.main,
    boxShadow: `inset 0 0 0 3px ${theme.palette.background.paper}`,
    backgroundColor: theme.palette.primary.main
  }
}))

export const RowMeta = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: 11,
  color: theme.palette.text.secondary
}))

export const RowTitle = styled(Typography)(({ theme }) => ({
  marginTop: 2,
  fontSize: 13.5,
  color: theme.palette.text.primary,
  lineHeight: 1.4
}))

export const PlaceholderRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': { borderBottom: 'none' }
}))
