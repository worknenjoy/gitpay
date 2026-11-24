import { styled } from '@mui/material/styles'

export const Total = styled('p')(({ theme }) => ({
  margin: 0,
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: 8,
  fontSize: 34,
  fontWeight: 500,
  lineHeight: 1.1,
  color: theme.palette.text.primary,
  fontVariantNumeric: 'tabular-nums'
}))

export const Unit = styled('span')(({ theme }) => ({
  fontSize: 13,
  fontWeight: 400,
  color: theme.palette.text.secondary
}))

export const Sponsors = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginTop: -4,
  fontSize: 13,
  color: theme.palette.text.secondary
}))
