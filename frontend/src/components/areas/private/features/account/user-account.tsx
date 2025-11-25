import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, Typography, Container } from '@mui/material'
import AccountTabs from './components/account-tabs'
import ProfileMainHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'

export const UserAccount = ({
  user,
  updateUser,
  changePassword,
  addNotification,
  history,
  deleteUser
}) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <ProfileMainHeader
            title={<FormattedMessage id="user.account.page.title" defaultMessage="Account" />}
            subtitle={
              <Typography variant="body2" color="textSecondary">
                <FormattedMessage
                  id="userAccount.subtitle"
                  defaultMessage="Manage your account settings, roles and permissions."
                />
              </Typography>
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <AccountTabs
            user={user}
            updateUser={updateUser}
            changePassword={changePassword}
            addNotification={addNotification}
            history={history}
            deleteUser={deleteUser}
          />
        </Grid>
      </Grid>
    </Container>
  )
}
