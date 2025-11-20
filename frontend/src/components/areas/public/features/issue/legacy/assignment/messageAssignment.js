import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  TextField
} from '@mui/material'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

class MessageAssignment extends Component {
  constructor(props) {
    super(props)
    this.state = { message: '' }
  }

  static defaultProps = { visible: false }

  static propTypes = {
    visible: PropTypes.bool,
    id: PropTypes.object,
    messageAction: PropTypes.func,
    to: PropTypes.number
  }

  onChangeMessage = (event) => this.setState({ message: event.target.value })

  messageAssignment = async () => {
    const { id, messageAction, to } = this.props
    const { message } = this.state
    console.log('messageAssignment', id, to, message)
    await messageAction(id, to, message)
    this.props.onClose()
  }

  render() {
    const { visible, onClose } = this.props
    const { message } = this.state

    return (
      <Container>
        <Dialog open={visible} onClose={onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            <FormattedMessage
              id="task.assignment.message.user"
              defaultMessage="Send a message to this user"
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography component="div">
                <FormattedMessage
                  id="task.assignment.message.reason"
                  defaultMessage="Send a message to this user interested."
                />
              </Typography>
            </DialogContentText>
            <TextField
              onChange={this.onChangeMessage}
              autoFocus
              name="message"
              multiline
              rows="3"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              <FormattedMessage id="task.assignment.actions.cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={message.length === 0}
              onClick={this.messageAssignment}
              variant="contained"
              color="secondary"
            >
              <FormattedMessage id="task.assignment.message.send" defaultMessage="Send Message" />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default MessageAssignment
