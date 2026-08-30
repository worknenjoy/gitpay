import { Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Card, {
  shouldForwardProp: (prop) => prop !== '$featured'
})<{ $featured?: boolean }>(({ theme, $featured }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  border: `1px solid ${$featured ? theme.palette.secondary.main : theme.palette.divider}`,
  boxShadow: $featured ? theme.shadows[2] : 'none'
}))

export const Tier = styled(Typography)({
  fontWeight: 600
})

export const Price = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 28,
  '& small': {
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.secondary
  }
}))

export const FeatureList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flexGrow: 1
}))

export const FeatureItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  fontSize: 14,
  color: theme.palette.text.secondary
}))
