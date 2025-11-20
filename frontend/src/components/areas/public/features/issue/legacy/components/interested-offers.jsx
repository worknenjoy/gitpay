import React from 'react'
import {
  Button,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material'
import MessageIcon from '@mui/icons-material/Message'
import MomentComponent from 'moment'
import { FormattedMessage } from 'react-intl'

export default function InterestedOffers({ offers, onMessage, assigned, onAccept, onReject }) {
  const onSendMessage = (id) => {
    onMessage(id)
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {offers?.map((offer) => (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={offer?.User?.username} src={offer?.User?.picture_url} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  {offer?.User?.username || offer?.User?.name}
                  <Chip
                    label={offer?.status || 'pending'}
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
                      sx={{ display: 'inline-block' }}
                      variant="subtitle1"
                      color="text.primary"
                    >
                      {offer?.User?.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      $ {offer?.value}
                    </Typography>
                    {offer?.suggestedDate && (
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Finish {MomentComponent(offer?.suggestedDate).fromNow()}
                      </Typography>
                    )}
                    {offer?.comment && (
                      <Typography
                        variant="body"
                        color="text.secondary"
                        component="div"
                        gutterBottom
                      >
                        Comment:
                        <br />
                        {offer?.comment}
                      </Typography>
                    )}
                    {offer?.learn && (
                      <Typography variant="body" color="text.secondary" gutterBottom>
                        <FormattedMessage
                          id="task.learn"
                          defaultMessage={'For learning purposes'}
                        />
                      </Typography>
                    )}
                    {offer?.createdAt && (
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        {MomentComponent(offer?.createdAt).fromNow()}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Button
                      onClick={(event) => onReject(event, offer)}
                      disabled={
                        assigned || offer.status === 'rejected' || offer.status === 'accepted'
                      }
                      variant="outlined"
                      color="error"
                      size={'small'}
                      style={{ marginRight: 20 }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={(event) => onAccept(event, offer)}
                      disabled={assigned || offer.status === 'accepted'}
                      variant="contained"
                      color="primary"
                      size={'small'}
                      style={{ marginRight: 20 }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={(e) => onSendMessage(offer.id)}
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
