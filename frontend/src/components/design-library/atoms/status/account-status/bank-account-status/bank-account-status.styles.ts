import { Theme } from '@mui/material/styles'
import { green, orange } from '@mui/material/colors'

export const getBankAccountStatusStyles = (theme: Theme) => ({
  pending: {
    backgroundColor: orange[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  active: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  inactive: {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  unknown: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  }
})

export default getBankAccountStatusStyles
