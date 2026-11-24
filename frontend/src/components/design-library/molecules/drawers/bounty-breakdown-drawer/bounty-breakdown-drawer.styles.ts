import { styled } from '@mui/material/styles'

export const PaymentsTitle = styled('h3')(({ theme }) => ({
  margin: '24px 0 8px',
  paddingTop: 16,
  borderTop: `1px solid ${theme.palette.divider}`,
  fontSize: 16,
  fontWeight: 600,
  color: theme.palette.text.primary
}))

export const Note = styled('p')(({ theme }) => ({
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
  margin: '16px 0 0',
  fontSize: 12.5,
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
  '& svg': { fontSize: 14, marginTop: 2, flexShrink: 0 }
}))
