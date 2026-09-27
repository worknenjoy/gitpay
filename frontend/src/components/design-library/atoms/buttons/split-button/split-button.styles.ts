import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const MenuItemLabel = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 500
}))

export const MenuItemDescription = styled(Typography)(({ theme }) => ({
  fontSize: 12.5,
  color: theme.palette.text.secondary
}))
