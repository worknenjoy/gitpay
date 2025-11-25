import React, { useState } from 'react'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import DeleteUser from '../features/account-details/deleteUser'

const DeleteAccountButton = ({ deleteUser, user, history }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const [deleteUserDialog, setDeleteUserDialog] = useState(false)

  const onDeleteUser = (user) => {
    deleteUser(user)
      .then((response) => {
        history.push('/')
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }

  return (
    <>
      <Button
        {...(isMobile ? { fullWidth: true, style: { marginBottom: 10 } } : {})}
        onClick={() => setDeleteUserDialog(true)}
        variant="outlined"
        style={{ color: '#353A42' }}
      >
        <FormattedMessage
          id="account.profile.settings.delete.user.button"
          defaultMessage="Delete my account"
        />
      </Button>
      <DeleteUser
        deleteUser={() => user && onDeleteUser(user)}
        user={user}
        visible={deleteUserDialog}
        onClose={() => setDeleteUserDialog(false)}
        onOpen={() => setDeleteUserDialog(true)}
      />
    </>
  )
}

export default DeleteAccountButton
