import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, Typography, Container } from '@mui/material'
import AccountTabs from './components/account-tabs'

export const UserAccount = ({
  user,
  updateUser,
  changePassword,
  addNotification,
  history,
  deleteUser,
}) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h5" gutterBottom style={{ marginTop: 40 }}>
            <FormattedMessage id="user.account.page.title" defaultMessage="Account" />
          </Typography>
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
