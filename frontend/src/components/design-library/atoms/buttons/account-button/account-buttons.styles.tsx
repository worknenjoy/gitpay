import { styled } from '@mui/material/styles'
import { Avatar, Button } from '@mui/material'

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginLeft: 20,
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 15,
  },
}))

export const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '20px !important',
  padding: '6px 3px',
  fontSize: 12,
  cursor: 'pointer',
  marginLeft: '10px !important',
  [theme.breakpoints.down('sm')]: {
    marginTop: 15,
  },
}))
