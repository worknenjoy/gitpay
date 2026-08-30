import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.75, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-of-type': {
    borderBottom: 'none'
  }
}))

export const Info = styled(Box)({
  minWidth: 0,
  flex: '1 1 auto'
})

export const Title = styled(Typography)({
  fontWeight: 500
})

export const UrlRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: 13,
  overflow: 'hidden'
}))

export const UrlText = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

export const Meta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: '0 0 auto'
}))

export const Price = styled(Typography)({
  fontWeight: 600,
  textAlign: 'right'
})

export const PaidCount = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
  textAlign: 'right'
}))
