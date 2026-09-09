import { styled } from '@mui/material/styles'

export const Row = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto auto',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(2.25, 2.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(1.25),
  transition: 'border-color 0.15s',
  '&:hover': {
    borderColor: theme.palette.text.primary
  }
}))

export const UrlRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary
}))
