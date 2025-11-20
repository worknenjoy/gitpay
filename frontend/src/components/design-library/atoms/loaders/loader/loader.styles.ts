import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'

export const Root = styled('div')(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}))

export const Progress = styled(CircularProgress)(() => ({
  color: '#009688',
}))

export default {
  Root,
  Progress,
}
