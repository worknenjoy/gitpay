import { ListItemText, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'

export const MenuListStyled = styled('div')<{ compact?: boolean }>(({ theme, compact }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: compact ? 'center' : 'flex-start',
  flexGrow: 1,
}))

export const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10,
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))

export const ListItemIconStyled = styled('div')(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}))

export const Primary = styled(ListItemText)(({ theme }) => ({
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
  textAlign: 'center',
}))

export default { MenuItemStyled, Primary, Icon, Category }
