import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2)
}))

export const RightActions = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  margin: 10
}))

export default { Root, RightActions }
