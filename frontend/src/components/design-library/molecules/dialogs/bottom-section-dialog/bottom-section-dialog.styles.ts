import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { Typography } from '@mui/material'

export const AppBarHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main
}))

export const AppBar = styled(MuiAppBar)({
  height: '100%',
  width: '100%'
})