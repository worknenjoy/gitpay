import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import Roles from './user-roles'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

// removed withStyles

class UpdateRole extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func
  }

  confirmDelete = (e) => {
    e.preventDefault()
    this.props.deleteUser(this.props.user)
    this.props.onClose()
  }

  render() {
    const { visible } = this.props

    return (
      <Container>
        <Dialog
          open={visible}
          onClose={() => this.props.onClose()}
          aria-labelledby="alert-dialog-title"
          fullWidth
          fullScreen
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="account.user.role.dialog.title" defaultMessage="User type" />
          </DialogTitle>
          <DialogContent>
            <Roles {...this.props} />
          </DialogContent>
        </Dialog>
      </Container>
    )
  }
}

export default UpdateRole
