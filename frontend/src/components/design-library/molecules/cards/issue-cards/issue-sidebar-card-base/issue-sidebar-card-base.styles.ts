import { styled } from '@mui/material/styles'

export const Card = styled('section', {
  shouldForwardProp: (prop) => prop !== 'dense'
})<{ dense?: boolean }>(({ theme, dense }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: dense ? '18px 18px 8px' : 18,
  display: 'flex',
  flexDirection: 'column',
  gap: dense ? 4 : 14
}))

export const Head = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10
})

export const Caption = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  '& img': { width: 14, height: 14 }
}))

export const Body = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 14
})

export const Footer = styled('p')(({ theme }) => ({
  margin: '-4px 0 0',
  fontSize: 12.5,
  lineHeight: 1.5,
  textAlign: 'center',
  color: theme.palette.text.secondary
}))
