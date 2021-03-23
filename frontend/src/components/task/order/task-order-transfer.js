import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

const TaskOrderTransfer = ({ open, tasks, order, onSend, onClose, task }) => {
  const classes = useStyles()
  const [selectedIndex, setSelectedIndex] = React.useState(null)
  const [currentTaskId, setCurrentTaskId] = React.useState(null)

  useEffect(() => {
    setCurrentTaskId(task.id)
    setSelectedIndex(task.id)
  }, [])

  const handleListItemClick = (event, taskId, index) => {
    setCurrentTaskId(taskId)
    setSelectedIndex(taskId)
  }

  const sendTransfer = () => {
    onSend(order, {
      id: currentTaskId
    })
    onClose()
  }

  return (
    <Dialog
      open={ open }
      onClose={ onClose }
      aria-labelledby='form-dialog-title'
    >
      <div>
        <DialogTitle id='form-dialog-title'>
          <FormattedMessage id='task.bounties.order.transfer.title' defaultMessage='Transfer bounty to another task' />
        </DialogTitle>
        <DialogContent>
          <Typography type='caption'>
            <FormattedMessage id='task.bounties.order.transfer.message' defaultMessage='You can transfer the bounty paid to one of these issues you created:' />
          </Typography>
          <div className={ classes.root }>
            <List component='nav' aria-label='secondary mailbox folder'>
              { tasks && tasks.data.map((t, index) => {
                return (
                  <ListItem
                    button
                    selected={ selectedIndex === t.id }
                    onClick={ (event) => handleListItemClick(event, t.id, index) }
                  >
                    <ListItemText primary={ t.title } />
                  </ListItem>
                )
              }) }
            </List>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={ onClose } variant='outlined' color='secondary' >
            <FormattedMessage id='general.buttons.close' defaultMessage='Close' />
          </Button>
          <Button disabled={ selectedIndex === null } onClick={ sendTransfer } variant='contained' color='secondary'>
            <FormattedMessage id='task.bounties.order.transfer.action' defaultMessage='transfer bounty order' />
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default TaskOrderTransfer
