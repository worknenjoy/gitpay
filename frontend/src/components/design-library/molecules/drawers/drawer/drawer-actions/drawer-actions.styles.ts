import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
  marginLeft: theme.spacing(1),
  '& button': {
    marginLeft: theme.spacing(2)
  }
}))

export default { Root }
