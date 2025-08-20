import { createStyles, styled, Theme } from '@mui/material/styles'
import { green, orange } from '@mui/material/colors'

const useStyles = styled((theme: Theme) =>
  createStyles({
    pending: {
      backgroundColor: orange[700],
      color: theme.palette.common.white
    },
    initiated: {
      backgroundColor: green[400],
      color: theme.palette.common.white
    },
    completed: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.common.white
    },
    failed: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white
    }
  })
)

export default useStyles
