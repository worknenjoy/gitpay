import { styled } from '@mui/material/styles'
import { CustomAlert as Alert } from '../alert/alert'

export const CustomAlert = styled(Alert)({
  marginBottom: 20,
  alignItems: 'flex-start',
  '& .MuiAlert-message': {
    flex: 1
  },
  '& .MuiAlert-icon': {
    paddingTop: 8
  },
  '& .MuiAlert-action': {
    alignSelf: 'center',
    paddingTop: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  '& .MuiAlert-action .MuiButton-root': {
    minWidth: 0,
    minHeight: 0,
    fontSize: '0.75rem',
    padding: '6px 10px',
    lineHeight: 1.2
  }
})
