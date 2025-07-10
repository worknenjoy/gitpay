import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { green, orange } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pending: {
      backgroundColor: orange[500],
      color: theme.palette.common.white
    },
    active: {
      backgroundColor: green[500],
      color: theme.palette.common.white
    },
    inactive: {
      backgroundColor: theme.palette.grey[400],
      color: theme.palette.common.white
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white
    }
  })
)

export default useStyles
