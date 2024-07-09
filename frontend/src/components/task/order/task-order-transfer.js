import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Container,
  Drawer,
  Typography,
  Button
} from '@material-ui/core'
import { SwapHorizontalCircleRounded } from '@material-ui/icons'
import ReactPlaceholder from 'react-placeholder'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

const TaskOrderTransfer = ({ open, tasks, order, onSend, onClose, task, listOrders }) => {
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

  const sendTransfer = async () => {
    await onSend(order, {
      id: currentTaskId
    })
    await listOrders()
    onClose()
  }

  return (
    <Drawer
      anchor='right'
      open={ open }
      onClose={ onClose }
      aria-labelledby='drawer-payment-transfer'
      PaperProps={{ style: { width: '40%', padding: 20 } }}
    >
      <Container>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id='task.bounties.order.transfer.title' defaultMessage='Transfer bounty to another task' />
        </Typography>
        <div>
          <Typography type='caption'>
            <FormattedMessage id='task.bounties.order.transfer.message' defaultMessage='You can transfer the bounty paid to one of these issues you created:' />
          </Typography>
          <div className={ classes.root }>
            <ReactPlaceholder type='text' rows={ 5 } ready={ tasks.completed } showLoadingAnimation={ true } >
              <List component='nav' style={{overflowY: 'scroll', height: '65vh', margin: '20px 0', border: '1px solid #ccc'}}>
                { tasks && tasks.data.map((t, index) => {
                  return (
                    !t.paid &&
                    <ListItem
                      button
                      selected={ selectedIndex === t.id }
                      onClick={ (event) => handleListItemClick(event, t.id, index) }
                    >
                      <ListItemAvatar>
                        <SwapHorizontalCircleRounded />
                      </ListItemAvatar>
                      <ListItemText primary={ t.title } secondary={ t.status } />
                    </ListItem>
                  )
                }) }
              </List>
            </ReactPlaceholder>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button onClick={ onClose } variant='outlined' color='secondary' style={{marginRight: 10}} >
            <FormattedMessage id='general.buttons.close' defaultMessage='Close' />
          </Button>
          <Button disabled={ selectedIndex === null } onClick={ sendTransfer } variant='contained' color='secondary'>
            <FormattedMessage id='task.bounties.order.transfer.action' defaultMessage='transfer bounty order' />
          </Button>
        </div>
      </Container>
    </Drawer>
  )
}

export default TaskOrderTransfer
