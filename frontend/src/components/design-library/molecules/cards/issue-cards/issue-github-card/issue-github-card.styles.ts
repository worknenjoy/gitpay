import { styled } from '@mui/material/styles'

export const Who = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6
})

export const OpenDot = styled('span')(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  '&[data-closed="true"]': { backgroundColor: '#8250df' }
}))

export const LinkedRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginTop: -6,
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary
}))

export const LinkedToggle = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  border: 0,
  background: 'none',
  padding: 0,
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  '& svg': { transition: 'transform .15s' },
  '&[aria-expanded="true"] svg': { transform: 'rotate(180deg)' }
}))

export const LinkedList = styled('ul')(({ theme }) => ({
  flexBasis: '100%',
  margin: '2px 0 0',
  padding: '8px 0 0 12px',
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  borderLeft: `2px solid ${theme.palette.divider}`
}))

export const LinkedItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
  '& a': {
    minWidth: 0,
    fontSize: 13,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: 'none'
  },
  '& a:hover': { textDecoration: 'underline' },
  '& b': { fontWeight: 500, color: theme.palette.primary.main }
}))
