import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

export const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  display: 'flex'
}))

export const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: 20,
  padding: 10
}))

export const StyledTabsVertical = styled('div')(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  width: 200,
  alignItems: 'flex-end'
}))

export const StyledTabsColumn = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column'
}))

// Not currently used in component; kept for parity
export const TabSpacing = styled('div')(() => ({
  margin: 10,
  marginRight: 20
}))

export const TabPanelRoot = styled('div')(() => ({
  width: '100%',
  marginTop: 20
}))

export const TabPanelVertical = styled('div')(() => ({
  marginTop: 0,
  width: '100%'
}))

export default {
  Root,
  StyledCard,
  StyledTabsVertical,
  StyledTabsColumn,
  TabSpacing,
  TabPanelRoot,
  TabPanelVertical
}
