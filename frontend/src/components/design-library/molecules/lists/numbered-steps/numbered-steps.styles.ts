import { styled, alpha } from '@mui/material/styles'

export const List = styled('ol')({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 10
})

export const Step = styled('li')({
  display: 'grid',
  gridTemplateColumns: '22px minmax(0, 1fr)',
  gap: 10,
  alignItems: 'start'
})

export const Number = styled('span')(({ theme }) => ({
  width: 22,
  height: 22,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  fontSize: 12,
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

export const Text = styled('span')(({ theme }) => ({
  fontSize: 13.5,
  lineHeight: 1.45,
  color: theme.palette.text.secondary,
  '& b, & strong': {
    fontWeight: 500,
    color: theme.palette.text.primary
  }
}))
