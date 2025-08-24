import { styled } from '@mui/material/styles'
import { AppBar, Grid, Container } from '@mui/material'

export const RootGrid = styled(Grid)(() => ({
  backgroundColor: '#F7F7F7'
}))

export const SecondaryBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light
}))

export const ContainerRoot = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4)
}))

export default { RootGrid, SecondaryBar, ContainerRoot }
