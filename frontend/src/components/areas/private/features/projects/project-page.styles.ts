import { styled } from '@mui/material/styles'

// Wrapper for the tabbed table area
export const RootTabs = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

// Optional utility styles kept for future parity if needed
export const GutterLeft = styled('div')({
  marginLeft: 10,
})

export const Media = styled('div')({
  width: 600,
})
