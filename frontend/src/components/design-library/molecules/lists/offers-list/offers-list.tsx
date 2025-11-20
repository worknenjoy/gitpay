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
  Divider
} from '@mui/material'
import MessageIcon from '@mui/icons-material/Message'
import MomentComponent from 'moment'
import { FormattedMessage } from 'react-intl'

interface OfferListProps {
  offers: any
  onMessage?: any
  assigned?: boolean
  onAccept?: any
  onReject?: any
  viewMode?: boolean
}

export default function OffersList({
  offers,
  onMessage,
  assigned,
  onAccept,
  onReject,
  viewMode
}: OfferListProps) {
  const onSendMessage = (id) => {
    onMessage(id)
  }

  return (
    <List style={{ width: '100%' }}>
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
                    variant="filled"
                    size="small"
                    style={{ marginLeft: 10, display: 'inline-block' }}
                  />
                </>
              }
              secondary={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography
                      style={{ display: 'inline-block' }}
                      variant="subtitle1"
                      color="primary"
                    >
                      {offer?.User?.name}
                    </Typography>
                    <Typography variant="subtitle2" color="secondary" gutterBottom>
                      $ {offer?.value}
                    </Typography>
                    {offer?.suggestedDate && (
                      <Typography variant="caption" color="secondary" gutterBottom>
                        Finish {MomentComponent(offer?.suggestedDate).fromNow()}
                      </Typography>
                    )}
                    {offer?.comment && (
                      <Typography variant="body1" color="secondary" component="div" gutterBottom>
                        Comment:
                        <br />
                        {offer?.comment}
                      </Typography>
                    )}
                    {offer?.learn && (
                      <Typography variant="body1" color="secondary" gutterBottom>
                        <FormattedMessage
                          id="task.learn"
                          defaultMessage={'For learning purposes'}
                        />
                      </Typography>
                    )}
                    {offer?.createdAt && (
                      <Typography variant="caption" color="secondary" gutterBottom>
                        {MomentComponent(offer?.createdAt).fromNow()}
                      </Typography>
                    )}
                  </div>

                  {!viewMode ? (
                    <div>
                      <Button
                        onClick={(event) => onReject(event, offer)}
                        disabled={
                          assigned || offer.status === 'rejected' || offer.status === 'accepted'
                        }
                        variant="outlined"
                        color="secondary"
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
                        <MessageIcon fontSize="small" />
                      </Button>
                    </div>
                  ) : null}
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
