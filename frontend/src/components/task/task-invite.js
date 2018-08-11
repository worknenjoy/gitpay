import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import styled from 'styled-components'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

class TaskInvite extends Component {
  constructor (props) {
    super(props)

    this.state = { open: false, message: '' }
  }

  static defaultProps = { visible: true }

  static propTypes = {
    visible: PropTypes.bool
  }

  onChangeMessage = event => this.setState({ message: event.target.value })

  removeAssignment = () => {

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
          <DialogTitle id='form-dialog-title'>Convidar alguém para realizar a tarefa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography type='subheading' gutterBottom>
                Texto a ser enviado junto com o convite
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
            <Button onClick={ () => this.props.onClose() } color='primary'>
              Cancelar
            </Button>
            <Button disabled={ message.length === 0 } onClick={ this.removeAssignment } variant='raised' color='secondary' >
              Aplicar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default TaskInvite
