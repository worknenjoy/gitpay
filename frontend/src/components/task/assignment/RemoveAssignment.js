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
import Icon from '@material-ui/icons/RemoveCircleOutline'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

const RemoveIcon = styled(Icon)`
  margin-right: .5rem;
`

class RemoveAssignment extends Component {
  constructor (props) {
    super(props)

    this.state = { open: false, message: '' }
  }

  static defaultProps = { visible: true }

  static propTypes = {
    visible: PropTypes.bool,
    remove: PropTypes.func,
    task: PropTypes.object
  }

  openModal = () => this.setState({ open: true })

  closeModal = () => this.setState({ open: false, message: '' })

  onChangeMessage = event => this.setState({ message: event.target.value })

  removeAssignment = () => {
    const { task, remove } = this.props
    const { message } = this.state

    remove(task.id, message)

    this.closeModal()
  }

  render () {
    const { visible } = this.props
    const { open, message } = this.state

    return (
      <Container>
        { visible &&
          <Button
            size='small'
            onClick={ this.openModal }>
            <RemoveIcon />
            <FormattedMessage id='task.assignment.remove.action' defaultMessage='Remove' />
          </Button>
        }

        <Dialog
          open={ open }
          onClose={ this.closeModal }
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <FormattedMessage id='task.assignment.remove.user' defaultMessage='Unassign user' />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography component='div'>
                <FormattedMessage id='task.assignment.remove.reason' defaultMessage='Why this user will not work on this task anymore?' />
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
            <Button onClick={ this.closeModal } color='primary'>
              <FormattedMessage id='task.assignment.actions.cancel' defaultMessage='Cancel' />
            </Button>
            <Button disabled={ message.length === 0 } onClick={ this.removeAssignment } variant='contained' color='secondary' >
              <FormattedMessage id='task.assignment.actions.apply' defaultMessage='Apply' />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default RemoveAssignment
