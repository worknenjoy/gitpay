import React from 'react'
import { FormattedMessage } from 'react-intl'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import MomentComponent from 'moment'
import { Root, SmallAvatar } from './issue-payments-list.styles'

export default function IssuePaymentsList({ orders }) {
  if (!orders) return <div />
  return (
    orders &&
    orders.length > 0 && (
      <Root dense>
        <Typography
          variant="caption"
          align="center"
          style={{ display: 'inline-block', width: '100%', marginBottom: 10 }}
        >
          Paid by
        </Typography>
        {orders &&
          orders.map((order) => {
            return (
              <ListItem key={order.id}>
                <ListItemAvatar style={{ minWidth: 34 }}>
                  {order.User ? (
                    <SmallAvatar
                      alt={`${(order.User && (order.User.name || order.User.username)) || 'Anonymous'}`}
                      src={order.User && order.User.profile_url}
                    />
                  ) : (
                    <SmallAvatar />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      {order.User ? (
                        <Typography variant="body2">
                          {(order.User && order.User.name) || order.User.username || 'Anonymous'}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          <FormattedMessage
                            id="task.payment.order.nouser"
                            defaultMessage="Some user"
                          />
                        </Typography>
                      )}
                      <Typography color="textSecondary" variant="caption">
                        {' '}
                        {MomentComponent(order.updatedAt).fromNow()}
                      </Typography>
                      <Typography variant="caption">
                        {' '}
                        with <i>{order.provider === 'paypal' ? 'Paypal' : 'Credit Card'}</i>
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption">
                    <strong>${order.amount}</strong>
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
      </Root>
    )
  )
}
