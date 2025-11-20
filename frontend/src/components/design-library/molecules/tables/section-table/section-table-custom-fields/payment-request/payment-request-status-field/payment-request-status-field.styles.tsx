import { Theme } from '@mui/material/styles'
import { green, orange } from '@mui/material/colors'

export const getPaymentRequestStatusFieldStyles = (theme: Theme) =>
  ({
    open: {
      backgroundColor: orange[500],
      color: theme.palette.common.white,
    },
    paid: {
      backgroundColor: green[500],
      color: theme.palette.common.white,
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white,
    },
  }) as const

export default getPaymentRequestStatusFieldStyles
