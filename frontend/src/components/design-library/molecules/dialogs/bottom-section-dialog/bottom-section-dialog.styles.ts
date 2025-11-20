import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { Toolbar, Typography } from '@mui/material'

export const TopBarStyled = styled(Toolbar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
}))

export const AppBarHeader = styled(Typography)(({ theme }) => ({
  width: '100%',
  color: theme.palette.common.white,
}))

export const AppBar = styled(MuiAppBar)({
  height: '100%',
  width: '100%',
})
