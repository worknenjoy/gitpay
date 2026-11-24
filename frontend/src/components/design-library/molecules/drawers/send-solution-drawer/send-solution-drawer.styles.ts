import { styled } from '@mui/material/styles'

export const Body = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  marginTop: 16,
  '& > .MuiAlert-root': { marginBottom: 0 }
}))

export const RequestPayment = styled('div')(({ theme }) => ({
  padding: '6px 14px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  '& .MuiFormControlLabel-root': { alignItems: 'flex-start' },
  '& .MuiCheckbox-root': { marginTop: -6 },
  '& b': { display: 'block', fontSize: 14, fontWeight: 500, color: theme.palette.text.primary },
  '& em': {
    display: 'block',
    fontStyle: 'normal',
    fontSize: 12.5,
    lineHeight: 1.45,
    marginTop: 2,
    color: theme.palette.text.secondary
  }
}))
