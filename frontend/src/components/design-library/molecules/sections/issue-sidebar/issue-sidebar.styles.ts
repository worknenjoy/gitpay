import { styled } from '@mui/material/styles'

export const SidebarRoot = styled('aside')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: '24px 24px 24px 0',
  [theme.breakpoints.down('md')]: {
    padding: '0 16px 24px'
  },
  '& > .share-bar-wrap': {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export const SpanText = styled('span')(() => ({
  display: 'block',
  marginTop: 8
}))
