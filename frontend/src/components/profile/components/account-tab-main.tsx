import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import Typography from '@mui/material/Typography';

import { Field } from '../account-details';
import ProviderLoginButtons from '../../session/provider-login-buttons';

const styles = (theme) => ({
  legend: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.palette.primary.dark,
  },
  fieldset: {
    border: `1px solid ${theme.palette.primary.light}`,
    marginBottom: 20
  }
})


const AccountTabMain = ({
  classes,
  user,
  updateUser,
  addNotification
}) => {
  const { provider, name, password } = user;
  const [ fieldName, setFieldName ] = useState<string>(name);
  const [ currentPassword, setCurrentPassword ] = useState<string>('');
  const [ newPassword, setNewPassword ] = useState<string>('');
  const [ confirmNewPassword, setConfirmNewPassword ] = useState<string>('');


  const handleUpdateAccount = (e) => {
    e.preventDefault();
    console.log('handleUpdateAccount', fieldName)
    updateUser && updateUser(user.id, { name: fieldName });
  }

  const onChangePassword = (e) => {
    e.preventDefault();
    if(newPassword !== confirmNewPassword) {
      addNotification && addNotification('Passwords do not match', 'error');
      return;
    }
    if(currentPassword === newPassword) {
      addNotification && addNotification('New password cannot be the same as the current password', 'error');
      return;
    }
    if(newPassword.length < 6) {
      addNotification && addNotification('Password must be at least 8 characters long', 'error');
      return;
    } 
    if(password !== currentPassword) {
      addNotification && addNotification('Current password is incorrect', 'error');
      return;
    }
    updateUser && updateUser(user.id, { currentPassword, newPassword, confirmNewPassword });
  }

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={ 12 } md={ 12 }>
            <fieldset className={ classes.fieldset }>
              <legend className={ classes.legend }>
                <Typography>
                  <FormattedMessage id='account.provider' defaultMessage='Provider' />
                </Typography>
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                  <ProviderLoginButtons provider={provider} position='flex-start' textPosition='left' />
                </Grid>
              </Grid>
            </fieldset>
            <fieldset className={ classes.fieldset }>
              <legend className={ classes.legend }>
                <Typography>
                  <FormattedMessage id='account.account' defaultMessage='Account' />
                </Typography>
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormattedMessage id='account.basic.name' defaultMessage='name'>
                    { (msg) => (
                      <Field
                        onChange={ (e) => setFieldName(e.target.value) }
                        name='name'
                        label={ msg }
                        value={ fieldName }
                      />
                    ) }
                  </FormattedMessage>
                </Grid>
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <div style={{float: 'right'}}>
                    <Button
                      type='submit'
                      variant='contained'
                      color='secondary'
                      onClick={ handleUpdateAccount }
                    >
                      <FormattedMessage id='account.user.actions.update' defaultMessage='Update Account' />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </fieldset>
            <fieldset className={ classes.fieldset }>
              <legend className={ classes.legend }>
                <Typography>
                  <FormattedMessage id='account.password.change.title' defaultMessage='Change password' />
                </Typography>
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormattedMessage id='account.basic.password.old' defaultMessage='Current password'>
                    { (msg) => (
                      <Field
                        name='currentPassword'
                        label={ msg }
                        disabled={provider}
                        onChange={ (e) => setCurrentPassword(e.target.value) }
                        type='password'
                      />
                    ) }
                  </FormattedMessage>
                  <FormattedMessage id='account.basic.password.old' defaultMessage='New password'>
                    { (msg) => (
                      <Field
                        name='newPassword'
                        label={ msg }
                        disabled={provider}
                        onChange={ (e) => setNewPassword(e.target.value) }
                        type='password'
                      />
                    ) }
                  </FormattedMessage>
                  <FormattedMessage id='account.basic.password.old' defaultMessage='Confirm new password'>
                    { (msg) => (
                      <Field
                        name='confirmNewPassword'
                        label={ msg }
                        disabled={provider}
                        onChange={ (e) => setConfirmNewPassword(e.target.value) }
                        type='password'
                      />
                    ) }
                  </FormattedMessage>
                </Grid>
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <div style={{float: 'right'}}>
                    <Button
                      type='submit'
                      variant='contained'
                      color='secondary'
                      disabled={provider}
                      onClick={onChangePassword}
                    >
                      <FormattedMessage id='account.user.actions.update' defaultMessage='Change password' />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </fieldset>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
          
        </Grid>
      </Grid>
    </form>
  );
}

export default injectIntl(withStyles(styles)(AccountTabMain));