import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'
import { FormControl } from 'material-ui/Form'
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
    this.props.onInvite(this.props.id, this.state.email, this.state.message)
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
          <DialogTitle id='form-dialog-title'>Convidar alguém para realizar a tarefa</DialogTitle>
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
                    Texto a ser enviado com o convite
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
              Cancelar
            </Button>
            <Button disabled={ message.length === 0 } onClick={ this.sendInvite } variant='raised' color='secondary' >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default TaskInvite
