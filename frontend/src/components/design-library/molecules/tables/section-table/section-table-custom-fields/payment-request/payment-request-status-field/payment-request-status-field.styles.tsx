import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { green, orange } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    open: {
      backgroundColor: orange[500],
      color: theme.palette.common.white
    },
    paid: {
      backgroundColor: green[500],
      color: theme.palette.common.white
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white
    }
  })
)

export default useStyles
