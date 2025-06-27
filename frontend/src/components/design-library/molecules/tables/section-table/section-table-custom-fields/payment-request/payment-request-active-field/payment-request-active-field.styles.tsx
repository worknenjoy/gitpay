import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    yes: {
      backgroundColor: green[400],
      color: theme.palette.common.white
    },
    no: {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[700]
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white
    }
  })
)

export default useStyles
