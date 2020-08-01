import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

const styles = theme => ({
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.light
    }
  }
})

class DeleteUser extends Component {
  constructor (props) {
    super(props)

    this.state = { open: false }
  }

  static defaultProps = { visible: true }

  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    deleteUser: PropTypes.func
  }

  onChangeInvite = event => this.setState({ [event.target.name]: event.target.value })

  confirmDelete = (e) => {
    e.preventDefault()
    this.props.deleteUser(this.props.user)
    this.props.onClose()
  }

  render () {
    const { visible, classes } = this.props

    return (
      <Container>
        <Dialog
          open={ visible }
          onClose={ () => this.props.onClose() }
          aria-labelledby='alert-dialog-title'
        >
          <DialogTitle id='alert-dialog-title'>
            <FormattedMessage id='account.profile.settings.delete.user.title' defaultMessage='Delete User' />
          </DialogTitle>
          <DialogContent>
            <Typography type='subheading' gutterBottom>
              <FormattedMessage id='account.profile.settings.delete.user.alert' defaultMessage='When you delete, you erase data associated with the user, such as tasks and interests.' />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => this.props.onClose() } color='primary'>
              <FormattedMessage id='account.profile.settings.delete.user.form.cancel' defaultMessage='Cancel' />
            </Button>
            <Button onClick={ this.confirmDelete } variant='contained' className={ classes.deleteButton } >
              <FormattedMessage id='account.profile.settings.delete.user.form.confirm' defaultMessage='Confirm' />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default withStyles(styles)(DeleteUser)
