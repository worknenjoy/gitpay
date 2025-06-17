import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { cyan, blue, lime, orange } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pending: {
      backgroundColor: orange[900],
      color: theme.palette.common.white
    },
    draft: {
      backgroundColor: orange[500],
      color: theme.palette.common.white
    },
    open: {
      backgroundColor: orange[300],
      color: theme.palette.common.white
    },
    paid: {
      backgroundColor: lime[800],
      color: theme.palette.common.white
    },
    failed: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white
    },
    uncollectible: {
      backgroundColor: cyan[500],
      color: theme.palette.common.white
    },
    void: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white
    },
    refunded: {
      backgroundColor: blue[500],
      color: theme.palette.common.white
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white
    }
  })
)

export default useStyles
