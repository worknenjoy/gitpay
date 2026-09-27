import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: theme.spacing(1.5)
}))

export const OptionCard = styled('button')(({ theme }) => ({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: theme.spacing(1.75, 2),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&[data-selected="true"]': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main} inset`
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5
  }
}))

export const OptionTitle = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 500
}))

export const OptionDescription = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.375),
  fontSize: 12.5,
  color: theme.palette.text.secondary,
  lineHeight: 1.5
}))
