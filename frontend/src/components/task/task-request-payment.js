import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import styled from 'styled-components'
import Icon from 'material-ui-icons/RemoveCircleOutline'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

const RemoveIcon = styled(Icon)`
  margin-right: .5rem;
`

class RequestPayment extends Component {
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
          <DialogTitle id='form-dialog-title'>Desassociar escolhido para realizar a tarefa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography type='subheading' gutterBottom>
                  Solicitar pagamento para esta tarefa
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

export default RequestPayment
