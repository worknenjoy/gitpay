import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Typography, Container } from '@material-ui/core';
import AccountTabs from './components/account-tabs';
import { changePassword } from '../../../../../actions/loginActions';


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
        <Grid item xs={ 12 } md={ 12 }>
          <Typography variant='h5' gutterBottom style={{marginTop: 40}}>
            <FormattedMessage id='user.account.page.title' defaultMessage='Account' />
          </Typography>
        </Grid>
        <Grid item xs={ 12 } md={ 12 }>
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

