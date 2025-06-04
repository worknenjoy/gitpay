import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { orange, green, blue } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      backgroundColor: green[400],
      color: theme.palette.common.white,
      '& .MuiChip-icon': {
        color: theme.palette.common.white,
      },
    },
    invoice: {
      backgroundColor: orange[600],
      color: theme.palette.common.white,
      '& .MuiChip-icon': {
        color: theme.palette.common.white,
      },
    },
    paypal: {
      backgroundColor: blue[300],
      color: theme.palette.common.white,
    },
    wallet: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white,
      '& .MuiChip-icon': {
        color: theme.palette.common.white,
      },
    },
    unknown: {
      backgroundColor: theme.palette.grey[400],
      color: theme.palette.common.white,
      '& .MuiChip-icon': {
        color: theme.palette.common.white,
      },
    },
  })
)

export default useStyles
