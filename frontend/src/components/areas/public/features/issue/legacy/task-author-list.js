import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { FormattedMessage } from 'react-intl'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Forum as MessageIcon } from '@mui/icons-material'
import nameInitials from 'name-initials'
import MessageAuthor from './task-message-author'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import LoginButton from '../../../../private/components/session/login-button'

const Root = styled(List)(({ theme }) => ({}))
const Inline = styled('span')(({ theme }) => ({ display: 'inline' }))

export default function AuthorList({ authors, logged, user, task, messageAuthor, location }) {
  const [openDialog, setOpenDialog] = useState(false)

  const handleMessageAuthorDialog = (e) => {
    e.preventDefault()
    setOpenDialog(true)
  }

  return (
    <React.Fragment>
      <Root>
        {authors &&
          authors.map((a) => {
            return (
              <React.Fragment>
                {a.name && (
                  <ListItem alignItems="center">
                    <ListItemAvatar>
                      {a.avatar_url ? (
                        <Avatar alt={nameInitials(a.name)} src={a.avatar_url} />
                      ) : (
                        <Avatar alt={nameInitials(a.name)}>{nameInitials(a.name)}</Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <a href="#" onClick={handleMessageAuthorDialog}>
                          <Typography variant="subtitle2">
                            {a.name}
                            {a.email && (
                              <MessageIcon
                                style={{
                                  display: 'inline',
                                  verticalAlign: 'middle',
                                  marginLeft: 10,
                                }}
                              />
                            )}
                          </Typography>
                        </a>
                      }
                    />
                  </ListItem>
                )}
              </React.Fragment>
            )
          })}
      </Root>
      <React.Fragment>
        {!logged ? (
          <Dialog open={openDialog}>
            <DialogTitle id="form-dialog-title">
              <FormattedMessage
                id="task.bounties.logged.info"
                defaultMessage="You need to login to send messages to the author"
              />
            </DialogTitle>
            <DialogContent>
              <div>
                <LoginButton referer={location} includeForm />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <MessageAuthor
            open={openDialog}
            userId={user.id}
            taskId={task.data.id}
            name={''}
            onClose={() => setOpenDialog(false)}
            onSend={messageAuthor}
          />
        )}
      </React.Fragment>
    </React.Fragment>
  )
}
