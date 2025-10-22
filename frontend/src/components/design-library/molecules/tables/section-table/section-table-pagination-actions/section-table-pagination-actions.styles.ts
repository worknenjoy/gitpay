import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  flexShrink: 0,
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(2.5),
}))

export default { Root }
