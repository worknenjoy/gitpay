import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
}))

export default function TaskPayments ({ orders }) {
  const classes = useStyles()

  return orders.length > 0 && (
    <List dense className={ classes.root }>
      <Typography variant='caption' align='center' style={ { display: 'inline-block', width: '100%', marginBottom: 10 } }>
        Paid by
      </Typography>
      { orders && orders.map((order) => {
        return (
          <ListItem key={ order.id }>
            <ListItemAvatar>
              <Avatar
                alt={
                  `${order.User.name}`
                }
              />
            </ListItemAvatar>
            <ListItemText primary={ `${order.User.name}` } />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                ${ order.amount }
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        )
      }) }
    </List>
  )
}
