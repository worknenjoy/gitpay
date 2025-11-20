import { Theme } from '@mui/material/styles'
import { green, orange, blue, red } from '@mui/material/colors'

export const getPaymentRequestTransferStatusFieldStyles = (theme: Theme) =>
  ({
    pending: {
      backgroundColor: orange[500],
      color: theme.palette.common.white,
    },
    initiated: {
      backgroundColor: blue[500],
      color: theme.palette.common.white,
    },
    completed: {
      backgroundColor: green[500],
      color: theme.palette.common.white,
    },
    error: {
      backgroundColor: red[500],
      color: theme.palette.common.white,
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white,
    },
  }) as const

export default getPaymentRequestTransferStatusFieldStyles
