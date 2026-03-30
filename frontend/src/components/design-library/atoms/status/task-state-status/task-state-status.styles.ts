import { styled } from '@mui/material/styles'
import { blue, green, grey, teal } from '@mui/material/colors'

const PREFIX = 'TaskStateStatus'

export const classes = {
  created: `${PREFIX}-created`,
  funded: `${PREFIX}-funded`,
  claimed: `${PREFIX}-claimed`,
  completed: `${PREFIX}-completed`
} as const

export const TaskStateStatusRoot = styled('div')(({ theme }) => ({
  [`.${classes.created}`]: {
    backgroundColor: grey[400],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': { color: theme.palette.common.white }
  },
  [`.${classes.funded}`]: {
    backgroundColor: blue[600],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': { color: theme.palette.common.white }
  },
  [`.${classes.claimed}`]: {
    backgroundColor: teal[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': { color: theme.palette.common.white }
  },
  [`.${classes.completed}`]: {
    backgroundColor: green[600],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': { color: theme.palette.common.white }
  }
}))

export default classes
