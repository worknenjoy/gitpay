import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import Grid from '@mui/material/Grid'
import { Button, Paper, useMediaQuery, useTheme } from '@mui/material'

import { Field } from 'design-library/atoms/inputs/fields/field/field'
import ProviderLoginButtons from '../../../../../../containers/auth/provider-login-buttons'
import DeleteAccountButton from './delete-account-button'

import { Fieldset, LegendText } from './account-tab-main.styles'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'
import { type ConfirmFieldValue } from 'design-library/molecules/dialogs/confirm-dialog/confirm-dialog'
import { useHistory } from 'react-router-dom'

const AccountTabMain = ({
  user,
  updateUser,
  changePassword,
  addNotification,
  deleteUser,
  updateUserEmail
}) => {
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { data } = user || {}
  const { login_strategy, provider, name, email } = data || {}
  const [fieldName, setFieldName] = useState<string>(name)
  const [fieldEmail, setFieldEmail] = useState<string>(email)
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
        addNotification('Your account has been successfully disconnected from GitHub.', {
          severity: 'success'
        })
    }
    if (disconnectAction === 'error') {
      addNotification &&
        addNotification('We had an error to disconnect from your Github account', {
          severity: 'error'
        })
    }
    if (connectGithubAction === 'success') {
      addNotification &&
        addNotification('Your account has been successfully connected to Github', {
          severity: 'success'
        })
    }
  }, [])

  const handleUpdateAccount = (e) => {
    e.preventDefault()
    const whatToUpdate = {}
    if (fieldName !== name) {
      whatToUpdate['name'] = fieldName
    }
    updateUser && updateUser(whatToUpdate)
  }

  const handleUpdateEmail = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    values: ConfirmFieldValue
  ) => {
    e.preventDefault()
    await updateUserEmail?.({
      newEmail: fieldEmail,
      currentPassword: values['password'],
      confirmCurrentPassword: values['confirmPassword']
    })
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      addNotification && addNotification('Passwords do not match', { severity: 'error' })
      return
    }
    if (currentPassword === newPassword) {
      addNotification &&
        addNotification('New password cannot be the same as the current password', {
          severity: 'error'
        })
      return
    }
    if (newPassword.length < 6) {
      addNotification &&
        addNotification('Password must be at least 8 characters long', { severity: 'error' })
      return
    }
    changePassword &&
      (await changePassword({
        old_password: currentPassword,
        password: newPassword
      }))
  }

  const shouldUpdateEmail = fieldEmail !== email
  const shouldUpdateName = fieldName !== name

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
                  <FormattedMessage id="account.account.basic" defaultMessage="Basic information" />
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
                  <div {...(isDesktop ? { float: 'right' } : { style: { textAlign: 'center' } })}>
                    <Button
                      {...(isMobile ? { fullWidth: true, style: { marginBottom: 10 } } : {})}
                      disabled={!shouldUpdateName}
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={handleUpdateAccount}
                    >
                      <FormattedMessage
                        id="account.user.actions.change.name"
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
                    id="account.account.email.change"
                    defaultMessage="Change email"
                  />
                </LegendText>
              </legend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <FormattedMessage id="account.basic.email" defaultMessage="email">
                    {(msg) => (
                      <Field
                        onChange={(e) => setFieldEmail(e.target.value)}
                        name="email"
                        label={msg}
                        value={fieldEmail}
                        disabled={!shouldAllowPasswordChange}
                      />
                    )}
                  </FormattedMessage>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <div {...(isDesktop ? { float: 'right' } : { style: { textAlign: 'center' } })}>
                    <ConfirmButton
                      {...(isMobile ? { fullWidth: true, style: { marginBottom: 10 } } : {})}
                      disabled={!shouldUpdateEmail}
                      type="submit"
                      variant="contained"
                      color="secondary"
                      label={
                        <FormattedMessage
                          id="account.user.actions.update.email"
                          defaultMessage="Change Email"
                        />
                      }
                      dialogMessage={
                        <FormattedMessage
                          id="account.user.actions.update.email.confirm"
                          defaultMessage="Are you sure you want to update your email address?"
                        />
                      }
                      confirmLabel={
                        <FormattedMessage
                          id="account.user.actions.update.email"
                          defaultMessage="Change Email"
                        />
                      }
                      cancelLabel={
                        <FormattedMessage id="account.actions.cancel" defaultMessage="Cancel" />
                      }
                      onConfirm={handleUpdateEmail}
                      confirmFields={{
                        type: 'password',
                        name: 'password',
                        confirmName: 'confirmPassword',
                        label: (
                          <FormattedMessage
                            id="account.basic.password.current"
                            defaultMessage="Current password"
                          />
                        ),
                        confirmLabel: (
                          <FormattedMessage
                            id="account.basic.password.current.confirm"
                            defaultMessage="Confirm current password"
                          />
                        )
                      }}
                    />
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
                  <div {...(isDesktop ? { float: 'right' } : { style: { textAlign: 'center' } })}>
                    <Button
                      {...(isDesktop ? {} : { fullWidth: true, style: { textAlign: 'center' } })}
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
            <DeleteAccountButton user={user} deleteUser={deleteUser} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}></Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default AccountTabMain
