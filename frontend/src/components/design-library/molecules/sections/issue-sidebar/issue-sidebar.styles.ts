import { styled } from '@mui/material/styles'

export const SidebarRoot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'contained'
})<{ contained?: boolean }>(({ theme, contained }) => ({
  backgroundColor: '#eee',
  padding: 25,
  // Off the page edge so the panel floats instead of being glued. Vertical spacing
  // comes from the page grid; inside a padded container (profile) none is needed.
  margin: contained ? 0 : '0 24px 0 0',
  borderRadius: 8,
  flex: 1,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  fontFamily: theme.typography.fontFamily,
  [theme.breakpoints.down('sm')]: {
    padding: 15,
    margin: contained ? 0 : '0 16px'
  },
  '& > .share-bar-wrap': {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
    '& > *': { maxWidth: '100%' }
  }
}))

export const SpanText = styled('span')(() => ({
  display: 'block',
  marginTop: 8
}))
