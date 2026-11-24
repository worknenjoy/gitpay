import { styled, alpha } from '@mui/material/styles'

export const Row = styled('button')(({ theme }) => ({
  font: 'inherit',
  width: 'calc(100% + 20px)',
  display: 'grid',
  gridTemplateColumns: '36px minmax(0, 1fr) 16px',
  gap: 12,
  alignItems: 'center',
  margin: '0 -10px',
  padding: 10,
  border: 0,
  borderRadius: 8,
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main
  },
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`,
    borderRadius: '0 0 8px 8px'
  }
}))

export const RowIcon = styled('span')(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { fontSize: 18 }
}))

export const RowText = styled('span')(({ theme }) => ({
  '& b': {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.text.primary
  },
  '& em': {
    display: 'block',
    fontStyle: 'normal',
    fontSize: 12.5,
    lineHeight: 1.4,
    marginTop: 1,
    color: theme.palette.text.secondary
  }
}))
