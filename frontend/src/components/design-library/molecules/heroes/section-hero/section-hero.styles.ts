import { styled } from '@mui/material/styles'
import { Avatar, ListItem, Typography } from '@mui/material'

export const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: 0
}))

export const ListItemTop = styled(ListItem)(({ theme }) => ({
  marginTop: 20
}))

export const HeroContent = styled(Typography)(({ theme }) => ({
  lineHeight: 1.5,
}))

export const AvatarPrimary = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main
}))
