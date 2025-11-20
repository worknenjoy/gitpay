import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import Grid from '@mui/material/Grid'
import { Button, Paper } from '@mui/material'

import { Field } from 'design-library/atoms/inputs/fields/field/field'
import ProviderLoginButtons from '../../../../../../containers/provider-login-buttons'
import DeleteAccountButton from './delete-account-button'

import { Fieldset, LegendText } from './account-tab-main.styles'

const AccountTabMain = ({
  user,
  updateUser,
  changePassword,
  addNotification,
  history,
  deleteUser
}) => {
  const { login_strategy, provider, name, password } = user
  const [fieldName, setFieldName] = useState<string>(name)
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')

  const shouldAllowPasswordChange = login_strategy === 'local' || login_strategy === null

  useEffect(() => {
    const queryParams = new URLSearchParams(history.location.search)
    const disconnectAction = queryParams.get('disconnectAction')
    const connectGithubAction = queryParams.get('connectGithubAction')
    if (disconnectAction === 'success') {
      addNotification &&
        addNotification('Your account has been successfully disconnected from GitHub.', 'success')
    }
    if (disconnectAction === 'error') {
      addNotification &&
        addNotification('We had an error to disconnect from your Github account', 'error')
    }
    if (connectGithubAction === 'success') {
      addNotification &&
        addNotification('Your account has been successfully connected to Github', 'success')
    }
  }, [])

  const handleUpdateAccount = (e) => {
    e.preventDefault()
    updateUser && updateUser({ name: fieldName })
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      addNotification && addNotification('Passwords do not match', 'error')
      return
    }
    if (currentPassword === newPassword) {
      addNotification &&
        addNotification('New password cannot be the same as the current password', 'error')
      return
    }
    if (newPassword.length < 6) {
      addNotification && addNotification('Password must be at least 8 characters long', 'error')
      return
    }
    changePassword &&
      (await changePassword({
        old_password: currentPassword,
        password: newPassword
      }))
  }

  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <form>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Fieldset>
              <legend>
                <LegendText>
                  <FormattedMessage id="account.provider.link" defaultMessage="Link accounts" />
                </LegendText>
              </legend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <ProviderLoginButtons
                    provider={provider}
                    login_strategy={login_strategy}
                    position="flex-start"
                    textPosition="left"
                  />
                </Grid>
              </Grid>
            </Fieldset>
            <Fieldset>
              <legend>
                <LegendText>
                  <FormattedMessage id="account.account" defaultMessage="Account" />
                </LegendText>
              </legend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <FormattedMessage id="account.basic.name" defaultMessage="name">
                    {(msg) => (
                      <Field
                        onChange={(e) => setFieldName(e.target.value)}
                        name="name"
                        label={msg}
                        value={fieldName}
                      />
                    )}
                  </FormattedMessage>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <div style={{ float: 'right' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={handleUpdateAccount}
                    >
                      <FormattedMessage
                        id="account.user.actions.update"
                        defaultMessage="Update Account"
                      />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Fieldset>
            <Fieldset>
              <legend>
                <LegendText>
                  <FormattedMessage
                    id="account.password.change.title"
                    defaultMessage="Change password"
                  />
                </LegendText>
              </legend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <FormattedMessage
                    id="account.basic.password.current"
                    defaultMessage="Current password"
                  >
                    {(msg) => (
                      <Field
                        name="currentPassword"
                        label={msg}
                        disabled={!shouldAllowPasswordChange}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        type="password"
                      />
                    )}
                  </FormattedMessage>
                  <FormattedMessage id="account.basic.password.new" defaultMessage="New password">
                    {(msg) => (
                      <Field
                        name="newPassword"
                        label={msg}
                        disabled={!shouldAllowPasswordChange}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                      />
                    )}
                  </FormattedMessage>
                  <FormattedMessage
                    id="account.basic.password.old"
                    defaultMessage="Confirm new password"
                  >
                    {(msg) => (
                      <Field
                        name="confirmNewPassword"
                        label={msg}
                        disabled={!shouldAllowPasswordChange}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        type="password"
                      />
                    )}
                  </FormattedMessage>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <div style={{ float: 'right' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={!shouldAllowPasswordChange}
                      onClick={onChangePassword}
                    >
                      <FormattedMessage
                        id="account.user.actions.change"
                        defaultMessage="Change password"
                      />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Fieldset>
            <DeleteAccountButton user={user} history={history} deleteUser={deleteUser} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}></Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default AccountTabMain
