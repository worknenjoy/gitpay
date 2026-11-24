import { styled, alpha } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
  margin: '10px 0 20px',
  fontSize: 14,
  color: theme.palette.text.secondary,
  '& a': {
    textDecoration: 'underline',
    textUnderlineOffset: 3
  }
}))

export const Row = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 14px'
})

export const Group = styled('span')({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6
})

export const StatusDot = styled('span')(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  '&[data-closed="true"]': {
    backgroundColor: '#8250df'
  }
}))

export const Sep = styled('span')(({ theme }) => ({
  width: 1,
  height: 16,
  backgroundColor: theme.palette.divider
}))

export const ProviderLogo = styled('img')({
  width: 16,
  height: 16,
  display: 'block'
})

export const MessageButton = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 30,
  padding: '0 12px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  borderRadius: 15,
  background: theme.palette.background.paper,
  color: theme.palette.primary.main,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  '& svg': { fontSize: 15 },
  '&:hover': {
    background: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
}))
