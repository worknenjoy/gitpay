import { styled, alpha } from '@mui/material/styles'

export const List = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: '0 14px'
}))

export const Name = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontWeight: 500
})

export const RepChips = styled('span')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6
})

export const RepChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 22,
  padding: '0 9px',
  borderRadius: 11,
  backgroundColor: alpha(theme.palette.primary.main, 0.07),
  fontSize: 12,
  color: theme.palette.text.secondary,
  '& b': {
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontVariantNumeric: 'tabular-nums'
  }
}))
