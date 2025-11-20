import { Avatar, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SidebarRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#eee',
  padding: 25,
  [theme.breakpoints.down('sm')]: {
    padding: 15,
  },
}))

export const SidebarSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: 20,
  marginBottom: 20,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
}))

export const SidebarItem = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: 15,
    maxWidth: '100%',
  },
}))

export const TaskInfoContent = styled('div')`
  vertical-align: super;
  margin-left: 5px;
  margin-top: 10px;
  display: inline-block;
  text-align: middle;
`

export const SpanText = styled('span')(() => ({
  display: 'inline-block',
  verticalAlign: 'middle',
}))

export const StatusChip = styled(Chip, { shouldForwardProp: (prop) => prop !== 'status' })<{
  status?: 'closed' | 'open'
}>(({ theme, status }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor: 'transparent',
  color: status === 'closed' ? theme.palette.error.main : theme.palette.primary.main,
}))

export const StatusAvatarDot = styled(Avatar, { shouldForwardProp: (prop) => prop !== 'status' })<{
  status?: 'closed' | 'open'
}>(({ theme, status }) => ({
  backgroundColor: status === 'closed' ? theme.palette.error.main : theme.palette.primary.main,
}))
