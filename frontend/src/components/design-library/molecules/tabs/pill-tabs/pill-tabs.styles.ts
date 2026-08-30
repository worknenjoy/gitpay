import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

// Wraps BaseTabs with descendant overrides for a pill/segmented-control look, rather than
// a new tab primitive — BaseTabs (MUI Tabs/Tab under the hood) stays untouched everywhere
// else it's used with the default underline style.
export const Root = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  '& .MuiTabs-root': {
    minHeight: 0,
    background: theme.palette.grey[100],
    borderRadius: 999,
    padding: 4,
    display: 'inline-flex'
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    minHeight: 32,
    minWidth: 0,
    padding: '6px 16px',
    margin: 0,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
    }
  }
}))
