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
} from '@material-ui/core'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

class MessageAssignment extends Component {
  constructor (props) {
    super(props)
    this.state = { message: '' }
  }

  static defaultProps = { visible: false }

  static propTypes = {
    visible: PropTypes.bool,
    task: PropTypes.object,
    messageAction: PropTypes.func
  }

  onChangeMessage = event => this.setState({ message: event.target.value })

  messageAssignment = async () => {
    const { task, messageAction, assign } = this.props
    const { message } = this.state
    await messageAction(task.id, assign.id, message)
    this.props.onClose()
  }

  render () {
    const { visible, onClose } = this.props
    const { message } = this.state

    return (
      <Container>
        <Dialog
          open={ visible }
          onClose={ onClose }
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <FormattedMessage id='task.assignment.message.user' defaultMessage='Send a message to this user' />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography component='div'>
                <FormattedMessage id='task.assignment.message.reason' defaultMessage='Send a message to this user interested.' />
              </Typography>
            </DialogContentText>
            <TextField
              onChange={ this.onChangeMessage }
              autoFocus
              name='message'
              multiline
              rows='3'
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ onClose } color='primary'>
              <FormattedMessage id='task.assignment.actions.cancel' defaultMessage='Cancel' />
            </Button>
            <Button disabled={ message.length === 0 } onClick={ this.messageAssignment } variant='contained' color='secondary' >
              <FormattedMessage id='task.assignment.message.send' defaultMessage='Send Message' />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default MessageAssignment
