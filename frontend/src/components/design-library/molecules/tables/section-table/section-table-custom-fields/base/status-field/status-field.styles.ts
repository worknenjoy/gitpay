import { styled } from '@mui/material/styles'
import { green, orange } from '@mui/material/colors'

// Prefix-based class names to keep compatibility with components expecting `classes[color]`
const PREFIX = 'StatusField'

export const classes = {
  pending: `${PREFIX}-pending`,
  created: `${PREFIX}-created`,
  in_transit: `${PREFIX}-in_transit`,
  paid: `${PREFIX}-paid`,
  unknown: `${PREFIX}-unknown`,
} as const

// Root wrapper that provides styles for the classnames above
export const StatusFieldRoot = styled('div')(({ theme }) => ({
  [`.${classes.pending}`]: {
    backgroundColor: orange[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white,
    },
  },
  [`.${classes.created}`]: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white,
    },
  },
  [`.${classes.in_transit}`]: {
    backgroundColor: orange[700],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white,
    },
  },
  [`.${classes.paid}`]: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white,
    },
  },
  [`.${classes.unknown}`]: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white,
    },
  },
}))

export default classes
