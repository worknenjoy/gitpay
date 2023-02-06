import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import MomentComponent from 'moment'

import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  }
}))

export default function TaskPayments ({ orders }) {
  const classes = useStyles()
  if (!orders) return <div />
  return orders && orders.length > 0 && (
    <List dense className={ classes.root }>
      <Typography variant='caption' align='center' style={ { display: 'inline-block', width: '100%', marginBottom: 10 } }>
        Paid by
      </Typography>
      { orders && orders.map((order) => {
        return (
          <ListItem key={ order.id }>
            <ListItemAvatar style={ { minWidth: 34 } }>
              {order.User
                ? <Avatar
                  className={classes.small}
                  alt={
                    `${order.User && (order.User.name || order.User.username) || 'Anonymous'}`
                  }
                  src={order.User && order.User.profile_url}
                />
                : <Avatar className={classes.small} />
              }
            </ListItemAvatar>
            <ListItemText primary={
              <React.Fragment>
                { order.User
                  ? <Typography variant='body2'>{ order.User && order.User.name || order.User.username || 'Anonymous' }</Typography>
                  : <Typography variant='body2'>
                    <FormattedMessage id='task.payment.order.nouser' defaultMessage='Some user' />
                  </Typography>
                }
                <Typography color='textSecondary' variant='caption'> { MomentComponent(order.updatedAt).fromNow() }</Typography>
                <Typography variant='caption'> with <i>{ order.provider === 'paypal' ? 'Paypal' : 'Credit Card' }</i></Typography>
              </React.Fragment>
            } />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                <strong>${ order.amount }</strong>
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        )
      }) }
    </List>
  )
}
