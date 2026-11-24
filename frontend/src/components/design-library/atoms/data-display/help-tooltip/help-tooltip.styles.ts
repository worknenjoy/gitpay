import { styled } from '@mui/material/styles'

export const Trigger = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.text.disabled,
  cursor: 'help',
  outline: 0,
  '& svg': { fontSize: 14 },
  '&:hover, &:focus-visible': {
    color: theme.palette.primary.main
  }
}))
