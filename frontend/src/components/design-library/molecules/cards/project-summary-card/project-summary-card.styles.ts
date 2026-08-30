import { Box, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.5)
}))

export const Head = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8
})

export const TitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  fontWeight: 500
}))

export const OrgLink = styled('a')(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.secondary.main
  }
}))

export const Slash = styled('span')(({ theme }) => ({
  color: theme.palette.text.disabled
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary
}))

export const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginTop: theme.spacing(0.5)
}))

export const Muted = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary
}))

export const Action = styled('a')(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  }
}))
