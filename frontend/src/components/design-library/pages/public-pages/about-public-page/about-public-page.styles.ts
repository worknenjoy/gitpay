import { styled } from '@mui/material/styles'
import { Avatar, ListItem } from '@mui/material'
import { Section } from '../home-public-page/CommonStyles'

export const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: 0,
}))

export const ListItemTop = styled(ListItem)(({ theme }) => ({
  marginTop: 20,
}))

export const AvatarPrimary = styled(Avatar)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

export const SectionBgContrast = styled(Section)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText,
}))
