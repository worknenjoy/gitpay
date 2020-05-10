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
} from '@material-ui/core'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

class TaskInvite extends Component {
  constructor (props) {
    super(props)

    this.state = { open: false, email: '', message: '' }
  }

  static defaultProps = { visible: true }

  static propTypes = {
    id: PropTypes.int,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onInvite: PropTypes.func
  }

  onChangeInvite = event => this.setState({ [event.target.name]: event.target.value })

  sendInvite = (e) => {
    e.preventDefault()
    this.props.onInvite(this.props.id, this.state.email, this.state.message, this.props.user)
    this.props.onClose()
  }

  render () {
    const { visible } = this.props
    const { message } = this.state

    return (
      <Container>
        <Dialog
          open={ visible }
          onClose={ () => this.props.onClose() }
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <FormattedMessage id='task.invite.title' defaultMessage='Invite someone to work on this task' />
          </DialogTitle>
          <DialogContent>
            <form onChange={ this.onChangeInvite } type='POST'>
              <FormControl fullWidth style={ { marginBottom: 20 } }>
                <Typography type='subheading' gutterBottom>
                  E-mail
                </Typography>
                <TextField
                  type='email'
                  autoFocus
                  name='email'
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <Typography type='subheading' gutterBottom>
                  <FormattedMessage id='task.invite.text.label' defaultMessage='Write a text to be sent with the invite' />
                </Typography>
                <TextField
                  autoFocus
                  name='message'
                  multiline
                  rows='3'
                  fullWidth
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => this.props.onClose() } color='primary'>
              <FormattedMessage id='task.invite.form.cancel' defaultMessage='Cancel' />
            </Button>
            <Button disabled={ message.length === 0 } onClick={ this.sendInvite } variant='contained' color='secondary' >
              <FormattedMessage id='task.invite.form.send' defaultMessage='Send' />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default TaskInvite
