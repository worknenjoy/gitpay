import { createStyles, styled, Theme } from '@mui/material/styles'
import { green } from '@mui/material/colors'

const useStyles = styled((theme: Theme) =>
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
