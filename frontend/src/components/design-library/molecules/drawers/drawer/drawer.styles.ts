import { styled } from '@mui/material/styles'
import { Fab } from '@mui/material'

export const CloseFab = styled(Fab, {
  shouldForwardProp: (prop) => prop !== '$compact'
})<{ $compact?: boolean }>(({ theme, $compact }) => ({
  position: 'absolute',
  right: theme.spacing($compact ? 1.5 : 2),
  top: theme.spacing($compact ? 1.5 : 2),
  backgroundColor: 'darkgray',
  color: 'white',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'gray',
    boxShadow: 'none'
  }
}))

export default { CloseFab }
