import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled('div')({
  display: 'inline-flex',
  alignItems: 'stretch',
  gap: 4,
  padding: 4,
  border: '1px solid',
  borderColor: 'inherit',
  borderRadius: 999
})

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
  }
}))

export const UrlText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: 12,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap'
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
