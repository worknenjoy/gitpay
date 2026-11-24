import { styled } from '@mui/material/styles'

export const List = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: '0 14px'
}))

export const Tags = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6
})
