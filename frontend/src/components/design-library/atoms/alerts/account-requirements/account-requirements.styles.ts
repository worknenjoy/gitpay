import { styled } from '@mui/material/styles'
import { CustomAlert as Alert } from '../alert/alert'

export const CustomAlert = styled(Alert)({
  marginBottom: 20,
  alignItems: 'flex-start',
  '& .MuiAlert-icon': {
    paddingTop: 8
  },
  '& .MuiAlert-action': {
    alignSelf: 'center',
    paddingTop: 0
  }
})
