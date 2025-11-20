import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Forum as MessageIcon } from '@mui/icons-material'
import nameInitials from 'name-initials'
import IssueMessageAuthorDialog from '../../../molecules/dialogs/issue-message-author-dialog/issue-message-author-dialog'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import LoginButton from '../../form-section/login-form/login-form-signin/login-form-signin'
import { Root, MainBlock } from './issue-author-list.styles'

export default function IssueAuthorList({ authors, user, task, messageAuthor }) {
  const { data: userData, logged } = user || {}
  const { data: taskData } = task || {}
  const [openDialog, setOpenDialog] = useState(false)

  const handleMessageAuthorDialog = (e) => {
    e.preventDefault()
    setOpenDialog(true)
  }

  return (
    <React.Fragment>
      <Typography variant="subtitle1" style={{ marginBottom: 10, marginTop: 20 }}>
        <FormattedMessage id="task.info.authors" defaultMessage="Imported by" />
      </Typography>

      <List component={Root as any}>
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
      </List>
      <React.Fragment>
        {!logged ? (
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              <FormattedMessage
                id="task.bounties.logged.info"
                defaultMessage="You need to login to send messages to the author"
              />
            </DialogTitle>
            <DialogContent>
              <MainBlock>
                <LoginButton onClose={() => setOpenDialog(false)} />
              </MainBlock>
            </DialogContent>
          </Dialog>
        ) : (
          <IssueMessageAuthorDialog
            open={openDialog}
            userId={userData?.id}
            taskId={taskData.id}
            name={''}
            onClose={() => setOpenDialog(false)}
            onSend={messageAuthor}
          />
        )}
      </React.Fragment>
    </React.Fragment>
  )
}
