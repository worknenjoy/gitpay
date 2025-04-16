import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'react-intl'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { Forum as MessageIcon } from '@material-ui/icons'
import nameInitials from 'name-initials'
import MessageAuthor from './task-message-author'
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

import LoginButton from '../../../private/components/session/login-button'

const useStyles = makeStyles((theme) => ({
  root: {

  },
  inline: {
    display: 'inline',
  },
}))

export default function AuthorList ({ authors, logged, user, task, messageAuthor, location }) {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)

  const handleMessageAuthorDialog = (e) => {
    e.preventDefault()
    setOpenDialog(true)
  }

  return (
    <React.Fragment>
      <List className={ classes.root }>
        { authors && authors.map(a => {
          return (
            <React.Fragment>
              { a.name &&
              <ListItem alignItems='center'>
                <ListItemAvatar>
                  { a.avatar_url ? (
                    <Avatar alt={ nameInitials(a.name) } src={ a.avatar_url } />
                  ) : (
                    <Avatar alt={ nameInitials(a.name) }>
                      { nameInitials(a.name) }
                    </Avatar>
                  ) }
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <a href='#' onClick={ handleMessageAuthorDialog }>
                      <Typography variant='subtitle2'>
                        { a.name }
                        { a.email && <MessageIcon style={ { display: 'inline', verticalAlign: 'middle', marginLeft: 10 } } /> }
                      </Typography>
                    </a>
                  }
                />
              </ListItem>
              }
            </React.Fragment>
          )
        }) }
      </List>
      <React.Fragment>
        { !logged ? (
          <Dialog open={ openDialog }>
            <DialogTitle id='form-dialog-title'>
              <FormattedMessage id='task.bounties.logged.info' defaultMessage='You need to login to send messages to the author' />
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
  )
}
