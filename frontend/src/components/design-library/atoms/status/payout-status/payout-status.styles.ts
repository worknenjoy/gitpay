import { styled } from '@mui/material/styles'
import { green, orange, red } from '@mui/material/colors'

// Prefix-based class names to keep compatibility with components expecting `classes[color]`
const PREFIX = 'PayoutStatus'

export const classes = {
  pending: `${PREFIX}-pending`,
  created: `${PREFIX}-created`,
  requested: `${PREFIX}-requested`,
  awaiting_payment: `${PREFIX}-awaiting_payment`,
  in_transit: `${PREFIX}-in_transit`,
  failed: `${PREFIX}-failed`,
  denied: `${PREFIX}-denied`,
  canceled: `${PREFIX}-canceled`,
  paid: `${PREFIX}-paid`,
  completed: `${PREFIX}-completed`,
  unknown: `${PREFIX}-unknown`
} as const

// Root wrapper that provides styles for the classnames above
export const PayoutStatusRoot = styled('div')(({ theme }) => ({
  [`.${classes.pending}`]: {
    backgroundColor: orange[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.created}`]: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  // Whop's initial withdrawal states — treated the same as pending/created.
  [`.${classes.requested}`]: {
    backgroundColor: orange[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.awaiting_payment}`]: {
    backgroundColor: orange[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.in_transit}`]: {
    backgroundColor: orange[700],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.failed}`]: {
    backgroundColor: red[700],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.canceled}`]: {
    backgroundColor: red[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  // Whop's rejected-withdrawal state — treated the same as failed.
  [`.${classes.denied}`]: {
    backgroundColor: red[700],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.paid}`]: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  // Whop's terminal successful state — treated the same as paid.
  [`.${classes.completed}`]: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  },
  [`.${classes.unknown}`]: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  }
}))

export default classes
