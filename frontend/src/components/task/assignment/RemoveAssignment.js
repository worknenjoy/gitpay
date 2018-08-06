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
            <RemoveIcon /> Remover
          </Button>
        }

        <Dialog
          open={ open }
          onClose={ this.closeModal }
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Tirar o pessoal da tarefa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography type='subheading' gutterBottom>
                  Por que ele <strong>não estará</strong> mais trabalhando nesta tarefa?
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

export default RemoveAssignment
