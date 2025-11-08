import { styled } from '@mui/material/styles'
import { List, ListItemButton, Typography } from '@mui/material'

export const TitleStyled = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}))

export const ListStyled = styled(List)(({ theme }) => ({
  marginLeft: theme.spacing(0),
  paddingLeft: theme.spacing(0),
}))

export const ListItemButtonStyled = styled(ListItemButton)(({ theme }) => ({
  marginLeft: theme.spacing(0),
  paddingLeft: theme.spacing(2),
}))