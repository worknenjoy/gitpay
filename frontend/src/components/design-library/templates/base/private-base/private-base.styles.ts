import { styled } from '@mui/material/styles'
import { AppBar, Grid, Container } from '@mui/material'

export const RootGrid = styled(Grid)(() => ({
  backgroundColor: '#F7F7F7'
}))

export const SecondaryBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light
}))

/**
 * Page padding for every profile (private) page — the one place to adjust it.
 * Values are theme spacing units (1 = 8px).
 */
export const PAGE_PADDING = {
  desktop: { y: 4, x: 6 },
  mobile: { y: 2, x: 2 }
}

// Gutters are disabled on the Container (see private-base.tsx) so this padding
// is the only horizontal spacing — no hidden MUI gutter on top of it.
export const ContainerRoot = styled(Container)(({ theme }) => ({
  padding: theme.spacing(PAGE_PADDING.desktop.y, PAGE_PADDING.desktop.x),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(PAGE_PADDING.mobile.y, PAGE_PADDING.mobile.x)
  }
}))

export default { RootGrid, SecondaryBar, ContainerRoot }
