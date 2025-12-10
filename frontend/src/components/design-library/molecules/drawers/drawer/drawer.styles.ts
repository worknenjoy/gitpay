import { styled } from '@mui/material/styles'
import { Fab } from '@mui/material'

export const CloseFab = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  backgroundColor: 'darkgray',
  color: 'white',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'gray',
    boxShadow: 'none'
  }
}))

export default { CloseFab }
