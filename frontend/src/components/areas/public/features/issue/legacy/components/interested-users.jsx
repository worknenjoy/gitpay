import React from 'react'
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
} from '@mui/material'
import MessageIcon from '@mui/icons-material/Message'
import MomentComponent from 'moment'

export default function InterestedUsers({ users, onMessage, onAccept, onReject, assigned }) {
  const onSendMessage = (id) => {
    onMessage(id)
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {users?.map((user) => (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={user?.User?.username} src={user?.User.picture_url} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  {user?.User?.username || user?.User?.name}
                  <Chip
                    label={user?.status}
                    color="secondary"
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 10, display: 'inline-block' }}
                  />
                </>
              }
              secondary={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography
                      sx={{ display: 'inline-block', marginRight: 10 }}
                      variant="subtitle1"
                      color="text.primary"
                    >
                      {user?.User?.name}
                    </Typography>
                    <Typography
                      sx={{ display: 'inline-block', marginRight: 10 }}
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {user?.User?.website}
                    </Typography>
                    <Typography
                      sx={{ display: 'inline-block', marginRight: 10 }}
                      variant="caption"
                      color="text.primary"
                    >
                      {user?.User?.message}
                    </Typography>
                    <Typography
                      sx={{ display: 'inline-block', marginRight: 10 }}
                      variant="caption"
                      color="text.primary"
                    >
                      {MomentComponent(user?.User?.createdAt).fromNow()}
                    </Typography>
                  </div>
                  <div>
                    <Button
                      disabled={
                        user?.status === 'rejected' || user?.status === 'accepted' || assigned
                      }
                      onClick={(id) => onReject(user.id)}
                      variant="outlined"
                      color="error"
                      size={'small'}
                      style={{ marginRight: 20 }}
                    >
                      Reject
                    </Button>
                    <Button
                      disabled={
                        user?.status === 'pending-confirmation' ||
                        user?.status === 'accepted' ||
                        assigned
                      }
                      onClick={(id) => onAccept(user.id)}
                      variant="contained"
                      color="primary"
                      size={'small'}
                      style={{ marginRight: 20 }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => onSendMessage(user.id)}
                      variant="outlined"
                      color="secondary"
                      size={'small'}
                    >
                      <MessageIcon size="small" />
                    </Button>
                  </div>
                </div>
              }
            />
          </ListItem>
          <Divider variant="fullWidth" component="li" />
        </>
      ))}
    </List>
  )
}
