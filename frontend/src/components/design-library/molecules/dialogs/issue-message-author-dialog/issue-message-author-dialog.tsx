import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
  TextField
} from '@mui/material'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

const IssueMessageAuthor = ({ open = false, userId, taskId, name, onClose, onSend }) => {
  const [message, setMessage] = useState('')

  const onChangeMessage = (event) => {
    setMessage(event.target.value)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    onSend(userId, taskId, message)
    onClose()
  }

  return (
    <Container>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <FormattedMessage id="task.message.title" defaultMessage="Send a message to the author" />
        </DialogTitle>
        <DialogContent>
          <form onChange={onChangeMessage} method="POST">
            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom>
                <FormattedMessage
                  id="task.message.author.label"
                  defaultMessage="Write a message to the author of this issue"
                />
              </Typography>
              {name && (
                <Typography variant="subtitle2" gutterBottom>
                  {name}
                </Typography>
              )}
              <TextField autoFocus name="message" multiline rows="5" fullWidth />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            <FormattedMessage id="task.message.form.cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={message.length === 0}
            onClick={sendMessage}
            variant="contained"
            color="secondary"
          >
            <FormattedMessage id="task.message.form.send" defaultMessage="Send" />
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default IssueMessageAuthor
