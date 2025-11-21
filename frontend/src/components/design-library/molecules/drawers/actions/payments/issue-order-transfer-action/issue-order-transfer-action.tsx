import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Drawer,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  ListItemButton
} from '@mui/material'
import { SwapHorizontalCircleRounded } from '@mui/icons-material'

const IssueOrderTransferAction = ({ open, tasks, order, onSend, onClose, task, listOrders, listTasks }) => {
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

  useEffect(() => {
    listTasks()
  }, [])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-labelledby="drawer-payment-transfer"
      PaperProps={{ style: { width: '40%', padding: 20 } }}
    >
      <Container>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage
            id="task.bounties.order.transfer.title"
            defaultMessage="Transfer bounty to another issue"
          />
        </Typography>
        <div>
          <Typography variant="caption">
            <FormattedMessage
              id="task.bounties.order.transfer.message"
              defaultMessage="You can transfer the bounty paid to one of these issues you created:"
            />
          </Typography>
          <div>
            {!tasks.completed ? (
              <div style={{ overflowY: 'hidden', height: '65vh', margin: '20px 0' }}>
                <Skeleton variant="rectangular" height={48} animation="wave" />
                <Skeleton variant="rectangular" height={48} animation="wave" />
                <Skeleton variant="rectangular" height={48} animation="wave" />
                <Skeleton variant="rectangular" height={48} animation="wave" />
                <Skeleton variant="rectangular" height={48} animation="wave" />
              </div>
            ) : (
              <List
                component="nav"
                style={{
                  overflowY: 'scroll',
                  height: '65vh',
                  margin: '20px 0',
                  border: '1px solid #ccc'
                }}
              >
                {tasks &&
                  tasks.data.map((t, index) => {
                    return (
                      !t.paid && (
                        <ListItemButton
                          key={t.id}
                          selected={selectedIndex === t.id}
                          onClick={(event) => handleListItemClick(event, t.id, index)}
                        >
                          <ListItemAvatar>
                            <SwapHorizontalCircleRounded />
                          </ListItemAvatar>
                          <ListItemText primary={t.title} secondary={t.status} />
                        </ListItemButton>
                      )
                    )
                  })}
              </List>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            style={{ marginRight: 10 }}
          >
            <FormattedMessage id="general.buttons.close" defaultMessage="Close" />
          </Button>
          <Button
            disabled={selectedIndex === null}
            onClick={sendTransfer}
            variant="contained"
            color="secondary"
          >
            <FormattedMessage
              id="task.bounties.order.transfer.action"
              defaultMessage="transfer bounty order"
            />
          </Button>
        </div>
      </Container>
    </Drawer>
  )
}

export default IssueOrderTransferAction
