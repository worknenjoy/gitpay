import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

class MessageAuthor extends Component {
  constructor(props) {
    super(props)
    this.state = { message: '' }
  }

  static defaultProps = { open: false }

  static propTypes = {
    open: PropTypes.bool,
    userId: PropTypes.number,
    taskId: PropTypes.number,
    name: PropTypes.string,
    onClose: PropTypes.func,
    onSend: PropTypes.func
  }

  onChangeMessage = (event) => this.setState({ [event.target.name]: event.target.value })

  sendMessage = (e) => {
    e.preventDefault()
    this.props.onSend(this.props.userId, this.props.taskId, this.state.message)
    this.props.onClose()
  }

  render() {
    const { open, name } = this.props
    const { message } = this.state

    return (
      <Container>
        <Dialog
          open={open}
          onClose={() => this.props.onClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <FormattedMessage
              id="task.message.title"
              defaultMessage="Send a message to the author"
            />
          </DialogTitle>
          <DialogContent>
            <form onChange={this.onChangeMessage} type="POST">
              <FormControl fullWidth>
                <Typography type="subheading" gutterBottom>
                  <FormattedMessage
                    id="task.message.author.label"
                    defaultMessage="Write a message to the author of this issue"
                  />
                </Typography>
                {name && (
                  <Typography type="subheading" gutterBottom>
                    {name}
                  </Typography>
                )}
                <TextField autoFocus name="message" multiline rows="5" fullWidth />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.onClose()} color="primary">
              <FormattedMessage id="task.message.form.cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={message.length === 0}
              onClick={this.sendMessage}
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
}

export default MessageAuthor
