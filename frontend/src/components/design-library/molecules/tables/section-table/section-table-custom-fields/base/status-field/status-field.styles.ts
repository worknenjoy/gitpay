import { createStyles, styled, Theme } from '@mui/material/styles'
import { green, orange } from '@mui/material/colors'

const useStyles = styled((theme: Theme) =>
  createStyles({
    pending: {
      backgroundColor: orange[500],
      color: theme.palette.common.white
    },
    created: {
      backgroundColor: green[500],
      color: theme.palette.common.white
    },
    in_transit: {
      backgroundColor: orange[700],
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
