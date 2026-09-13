import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'stretch',
  gap: 4,
  padding: 4,
  border: '1px solid',
  borderColor: 'inherit',
  borderRadius: 999,
  // Full-width on mobile instead of a content-sized pill — there's no
  // second column to sit beside there, so it reads better spanning the row.
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    width: '100%'
  }
}))

export const UrlButton = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 6px 6px 12px',
  border: 0,
  background: 'transparent',
  borderRadius: 999,
  cursor: 'pointer',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  // Grow to fill the now full-width bar and center its own content within
  // that space, rather than staying pinned to the left edge.
  [theme.breakpoints.down('sm')]: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center'
  }
}))

export const UrlText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: 12,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  // The bar is full-width now, but the URL is still the one part that can
  // run long — let it shrink and ellipsis rather than force the bar wider.
  [theme.breakpoints.down('sm')]: {
    flex: '0 1 auto',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

export const CopyLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: 10,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  padding: '3px 9px',
  borderRadius: 999,
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.action.hover,
  '&[data-copied="true"]': {
    color: theme.palette.primary.main
  },
  [theme.breakpoints.down('sm')]: {
    flexShrink: 0
  }
}))

export const Separator = styled('span')(({ theme }) => ({
  width: 1,
  margin: '6px 2px',
  backgroundColor: theme.palette.divider
}))

export const Targets = styled('div')({
  display: 'flex',
  gap: 2
})
