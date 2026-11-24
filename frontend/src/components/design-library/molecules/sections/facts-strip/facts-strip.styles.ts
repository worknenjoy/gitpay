import { styled } from '@mui/material/styles'

export const Root = styled('section', {
  shouldForwardProp: (prop) => prop !== 'columns'
})<{ columns: number }>(({ theme, columns }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8
}))

export const Cell = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  padding: '12px 14px',
  minWidth: 0,
  '& + &': {
    borderLeft: `1px solid ${theme.palette.divider}`
  }
}))

export const Label = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  color: theme.palette.text.secondary
}))

export const Value = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  minHeight: 22,
  fontSize: 13.5,
  fontWeight: 500,
  color: theme.palette.text.primary,
  maxWidth: '100%'
}))

export const Sub = styled('span')(({ theme }) => ({
  marginTop: -4,
  fontSize: 12,
  color: theme.palette.text.secondary
}))
