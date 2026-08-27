import { styled } from '@mui/material/styles'

export const DocsAlertRoot = styled('div')(({ theme }) => ({
  paddingBottom: 10,
  display: 'flex',
  alignItems: 'center'
}))

export const IconCenter = styled('span')(({ theme }) => ({
  verticalAlign: 'middle',
  paddingRight: 5,
  color: theme.palette.action.active,
  display: 'flex'
}))

export const Text = styled('p')(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: 5,
  fontSize: 11,
  marginBottom: 0
}))

export const DocsLink = styled('a')(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  '&:hover': {
    textDecoration: 'underline'
  }
}))
