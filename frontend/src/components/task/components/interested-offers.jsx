import React from 'react';
import { 
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@material-ui/core';
import MessageIcon from '@mui/icons-material/Message';


export default function InterestedOffers({ offers, onMessage, assigned }) {
  const onSendMessage = (id) => {
    onMessage(id);
  }
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {offers?.map((offer) => (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={ offer?.User?.username } src={ offer?.User?.picture_url} />
            </ListItemAvatar>
            <ListItemText
              primary={ offer?.User?.username }
              secondary={
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>
                    <Typography
                      sx={{ display: 'inline-block' }}
                      variant="subtitle1"
                      color="text.primary"
                    >
                      { offer?.User?.name }
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      $ {offer?.value}
                    </Typography>
                  </div>
                  <div>
                    <Button disabled={assigned} variant="outlined" color="error" size={'small'} style={{marginRight: 20}}>
                      Reject
                    </Button>
                    <Button disabled={assigned} variant="contained" color="primary" size={'small'} style={{marginRight: 20}}>
                      Accept
                    </Button>
                    <Button onClick={(e) => onSendMessage(offer.id)} variant="outlined" color="secondary" size={'small'}>
                      <MessageIcon size='small' />
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
  );
}