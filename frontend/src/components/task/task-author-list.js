import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { Forum as MessageIcon } from '@material-ui/icons'
import nameInitials from 'name-initials'
import MessageAuthor from './task-message-author'

const useStyles = makeStyles((theme) => ({
  root: {
    
  },
  inline: {
    display: 'inline',
  },
}));

export default function AuthorList({ authors, logged, user, task, messageAuthor, location }) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);

  const handleMessageAuthorDialog = (e) => {
    e.preventDefault()
    setOpenDialog(true)
  }

  return (
    <React.Fragment>
      <List className={classes.root}>
        {authors && authors.map(a => {
          return (
            <ListItem alignItems="center">
              <ListItemAvatar>
                { a.avatar_url ? (
                  <Avatar alt={nameInitials(a.name)} src={a.avatar_url} />
                ) : (
                  <Avatar alt={nameInitials(a.name)}>
                    {nameInitials(a.name)}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <a href='#' onClick={ handleMessageAuthorDialog }>
                    <Typography variant='subtitle2'>
                      {a.name}
                      { a.email && <MessageIcon style={{display: 'inline', verticalAlign: 'middle', marginLeft: 10}} />}
                    </Typography>
                  </a>
                }
              />
            </ListItem>
          )
        })}
      </List>
      <React.Fragment>
        { !logged ? (
          <Dialog open={ openDialog }>
            <DialogTitle id='form-dialog-title'>
              <FormattedMessage id='task.bounties.logged.info' defaultMessage='You need to login to be assigned to this task' />
            </DialogTitle>
            <DialogContent>
              <div className={ classes.mainBlock }>
                <LoginButton referer={ location } includeForm />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <MessageAuthor
            open={ openDialog }
            userId={ user.id }
            taskId={ task.data.id }
            name={ '' }
            onClose={ () => setOpenDialog(false) }
            onSend={ messageAuthor }

          />
        ) }
      </React.Fragment>
    </React.Fragment>
  );
}
