import { styled } from '@mui/material/styles'
import { CardHeader, Avatar, Link } from '@mui/material'

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    textAlign: 'center',
  },
}))

export const StyledCardAvatar = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
  },
}))

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `4px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.down('sm')]: {
    margin: 'auto',
    display: 'block',
    marginBottom: 5,
  },
}))

export const TaskTitle = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default { StyledCardHeader, StyledCardAvatar, StyledAvatar, TaskTitle }
