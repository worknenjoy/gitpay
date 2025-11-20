import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
  TextField,
} from '@mui/material'
import { Container } from './issue-invite-dialog.styles'

type Props = {
  id?: number
  visible?: boolean
  onClose: (e?: any) => void
  onInvite: (id: number | undefined, email: string, message: string, user?: any) => void
  user?: any
}

const TaskInvite: React.FC<Props> = ({ id, visible = true, onClose, onInvite, user }) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const onChangeInvite = (event: any) => {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'message') setMessage(value)
  }

  const sendInvite = (e: any) => {
    e.preventDefault()
    onInvite(id, email, message, user)
    onClose(e)
  }

  return (
    <Container>
      <Dialog open={visible} onClose={(e) => onClose(e)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <FormattedMessage
            id="task.invite.title"
            defaultMessage="Invite someone to work on this task"
          />
        </DialogTitle>
        <DialogContent>
          <form onChange={onChangeInvite} method="POST">
            <FormControl fullWidth style={{ marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>
                E-mail
              </Typography>
              <TextField type="email" autoFocus name="email" fullWidth />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage
                  id="task.invite.text.label"
                  defaultMessage="Write a text to be sent with the invite"
                />
              </Typography>
              <TextField autoFocus name="message" multiline rows="3" fullWidth />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => onClose(e)} color="primary">
            <FormattedMessage id="task.invite.form.cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={message.length === 0}
            onClick={sendInvite}
            variant="contained"
            color="secondary"
          >
            <FormattedMessage id="task.invite.form.send" defaultMessage="Send" />
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default TaskInvite
