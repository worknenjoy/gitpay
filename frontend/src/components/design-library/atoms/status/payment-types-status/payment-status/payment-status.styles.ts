import { Theme } from '@mui/material/styles'
import { orange, green, blue, yellow } from '@mui/material/colors'

export const getPaymentStatusStyles = (theme: Theme) => ({
  open: {
    backgroundColor: yellow[700],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  pending: {
    backgroundColor: orange[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  succeeded: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  failed: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  expired: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  refunded: {
    backgroundColor: blue[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  canceled: {
    backgroundColor: theme.palette.grey[500],
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
