import { styled } from '@mui/material/styles'

export const MenuItemStyled = styled('div')(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10
}))

export const Primary = styled('span')(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: '11px !important',
  fontWeight: 500
}))

export const Icon = styled('span')(({ theme }) => ({
  marginRight: 5,
  color: theme.palette.primary.contrastText
}))

export const Category = styled('span')(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '0.58rem',
  textTransform: 'uppercase',
  fontWeight: 600,
  marginBottom: 16,
  paddingLeft: 16
}))

export default { MenuItemStyled, Primary, Icon, Category }
