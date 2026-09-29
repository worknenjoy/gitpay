import { Theme, alpha } from '@mui/material/styles'

// Muted, light-fill chip styles (matches the Solutions page's merge status) rather than a
// solid/vivid fill — a merged PR/issue is a calmer signal than e.g. a failed payment.
const chipTypography = {
  fontWeight: 600,
  '& .MuiChip-label': { px: 1.25 }
}

export const getMergeStatusStyles = (theme: Theme) => ({
  merged: {
    ...chipTypography,
    backgroundColor: alpha(theme.palette.success.light, 0.15),
    color: theme.palette.success.dark
  },
  open: {
    ...chipTypography,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary
  },
  closed: {
    ...chipTypography,
    backgroundColor: alpha(theme.palette.error.light, 0.15),
    color: theme.palette.error.dark
  }
})

export default getMergeStatusStyles
