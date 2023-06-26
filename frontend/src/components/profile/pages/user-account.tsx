import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Typography } from '@material-ui/core';
import AccountTabs from '../components/account-tabs';


export const UserAccount = ({ 
  user,
  updateUser,
  addNotification
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={ 12 } md={ 12 }>
          <Typography variant='h6' gutterBottom>
            <FormattedMessage id='user.account.page.title' defaultMessage='Account' />
          </Typography>
        </Grid>
        <Grid item xs={ 12 } md={ 12 }>
          <AccountTabs user={user} updateUser={updateUser} addNotification={addNotification} />
        </Grid>
    </Grid>
  )
}

