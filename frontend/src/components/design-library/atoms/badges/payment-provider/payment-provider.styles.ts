import { styled } from '@mui/material/styles'
import { orange, green, blue } from '@mui/material/colors'

const PaymentProvider = styled('span')(({ theme }) => ({
  '&.card': {
    backgroundColor: green[400],
    color: theme.palette.common.white
  },
  '&.invoice': {
    backgroundColor: orange[600],
    color: theme.palette.common.white
  },
  '&.paypal': {
    backgroundColor: blue[300],
    color: theme.palette.common.white
  },
  '&.wallet': {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white
  },
  '&.unknown': {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.common.white
  },
  // Ensure nested Chip icon keeps proper contrast when used inside a Chip
  '& .MuiChip-icon': {
    color: theme.palette.common.white
  }
}))

export default PaymentProvider
