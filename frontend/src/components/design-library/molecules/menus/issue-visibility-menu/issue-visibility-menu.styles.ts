import { styled } from '@mui/material/styles'

export const Trigger = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 24,
  padding: '0 8px',
  marginLeft: -8,
  border: '1px solid transparent',
  borderRadius: 12,
  background: 'transparent',
  fontSize: 13.5,
  fontWeight: 500,
  color: theme.palette.text.primary,
  cursor: 'pointer',
  '& svg': { fontSize: 15, color: theme.palette.text.secondary },
  '&:hover, &[aria-expanded="true"]': {
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.action.hover
  }
}))

export const ReadOnly = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13.5,
  fontWeight: 500,
  color: theme.palette.text.primary,
  '& svg': { fontSize: 15, color: theme.palette.text.secondary }
}))
