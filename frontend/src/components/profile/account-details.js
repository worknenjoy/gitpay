import React, { useEffect, useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core';
import {
  Grid,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Input,
  Select,
} from '@material-ui/core';

import CountryPicker, { countryCodes } from './country-picker';

import messages from './messages';

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

const AccountDetails = ({
  intl,
  account,
  updateAccount,
  user,
  updateUser,
  createBankAccount,
  getBankAccount,
  bankAccount,
  fetchAccount,
  classes
}) => {

  const [ accountData, setAccountData ] = useState({})
  const [ userId, setUserId ] = useState('');
  const [ openCountryPicker, setOpenCountryPicker ] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!e.target) return false
    let formData = {
      'business_profile[url]': e.target['business_profile[url]'].value,
      'individual[phone]': e.target['individual[phone]'].value,
      'individual[first_name]': e.target['individual[first_name]'].value,
      'individual[last_name]': e.target['individual[last_name]'].value,
      'individual[address][city]':
        e.target['individual[address][city]'].value,
      'individual[address][line1]':
        e.target['individual[address][line1]'].value,
      'individual[address][line2]':
        e.target['individual[address][line2]'].value,
      'individual[address][postal_code]':
        e.target['individual[address][postal_code]'].value,
      'individual[address][state]':
        e.target['individual[address][state]'].value,
      'individual[dob][day]': e.target['individual[dob][day]'].value,
      'individual[dob][month]': e.target['individual[dob][month]'].value,
      'individual[dob][year]': e.target['individual[dob][year]'].value
    }

    if (e.target['individual[id_number]'].value) {
      formData['individual[id_number]'] =
        e.target['individual[id_number]'].value
    }
    setAccountData(formData)
    updateAccount(userId, formData)
  }
  const onChange = (e) => {

  }

  const Field = ({name, label, type = 'text', required = false, defaultValue, placeholder, disabled}) => {
    return (
      <FormControl style={{width: '100%'}}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Input
          id={name}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          fullWidth
          style={{width: '100%'}}
          placeholder={placeholder}
          disabled={disabled}
        />
      </FormControl>
    )
  }

  useEffect(() => {
    if (user.user.id) {
      const userId = user.user.id
      fetchAccount(userId)
    }
  }, [user]);

  return (
    <form
      onSubmit={handleSubmit}
      onChange={onChange}
      style={{ marginTop: 20, marginBottom: 20, width: '100%' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CountryPicker open={openCountryPicker} onClose={() => setOpenCountryPicker(false)} classes={classes} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="account-details-personal-information-title" defaultMessage="Account details" />
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <fieldset className={classes.fieldset}>
            <legend className={classes.legend}>
              <Typography>
                <FormattedMessage id="account-details-country-information" defaultMessage="Country" />
              </Typography>
            </legend>
            <Grid container spacing={2}>
              {account && account.data.country ? 
                <div style={{display: 'flex', alignItems: 'center', padding: 20}}>
                  <img width='48' src={ require(`../../images/countries/${countryCodes.find(c => c.code === account.data.country).image}.png`) } />
                  <Typography component='span' style={{marginLeft: 10}}>
                    { countryCodes.find(c => c.code === account.data.country).country }
                  </Typography>
                </div>
               : 
                <Typography style={{padding: 20}}>loading...</Typography>
              }
              <code style={{display: 'none'}}>{account && JSON.stringify(account.data)}</code>
            </Grid>
          </fieldset>
        </Grid>
        <Grid item xs={12} md={12}>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            <Typography>
              <FormattedMessage id="account-details-personal-information" defaultMessage="Personal details" />
            </Typography>
          </legend>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <FormattedMessage id='account.verify.firstName' defaultMessage='First name'>
                {(msg) => (
                  <Field  
                    name="individual[first_name]"
                    label={msg}
                    defaultValue={account.data.individual && account.data.individual.first_name}
                  />
                )}
              </FormattedMessage>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormattedMessage id='account.verify.lastName' defaultMessage='Last name'>
                {(msg) => (
                  <Field
                    name="individual[last_name]"
                    label={msg}
                    defaultValue={account.data.individual && account.data.individual.last_name}
                  />
                )}
              </FormattedMessage>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Field 
                name="individual[id_number]"
                label="ID number"
                placeholder={
                  account.data.individual && account.data.individual
                    .id_number_provided
                    ? intl.formatMessage(messages.documentProvided)
                    : intl.formatMessage(messages.documentProvide)
                }
                disabled={
                  account.data.individual && account.data.individual.id_number_provided
                }
                defaultValue={
                  account.data.individual && account.data.individual.id_number
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormattedMessage id='account.verify.phone_number' defaultMessage='Phone number'>
                {(msg) => (
                  <Field
                    name="individual[phone]"
                    label={msg}
                    defaultValue={account.data.individual && account.data.individual.phone}
                  />
                )}
              </FormattedMessage>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormattedMessage id='account.verify.business_profile_url' defaultMessage='Website'>
                {(msg) => (
                  <Field 
                    name="business_profile[url]"
                    label={msg}
                    defaultValue={account.data.business_profile && account.data.business_profile.url}
                  />
                )}
              </FormattedMessage>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography color='textPrimary' style={{marginBottom: -20, marginTop: 10}}>
                <FormattedMessage id="account-details-personal-information-birth-date" defaultMessage="Birth date" />
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Field name="individual[dob][day]" label="Day" type="number" defaultValue={account.data.individual && account.data.individual.dob && account.data.individual.dob.day} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl style={{width: '100%'}}>
                <Select
                  autoWidth
                  native
                  name='individual[dob][month]'
                  style={{ marginRight: 8, marginTop: 16, width: '100%' }}
                  onChange={(event) => {
                    setMonthOfBirth(event.target.value)
                  }}
                >
                  <FormattedMessage id='account.details.month' defaultMessage='Month of birth'>{(msg) => <option value='' key={'default'}>{msg}</option>}</FormattedMessage>
                  {[[0, 'Jan'], [1, 'Fev'], [2, 'Mar'], [3, 'Apr'], [4, 'May'], [5, 'June'], [6, 'Aug'], [7, 'Set'], [8, 'Oct'], [9, 'Nov'], [10, 'Dec']].map(
                    (item, i) => {
                      return (
                        <option selected={account.data.individual && !!(item === account.data.individual.dob.month)} key={i} value={item[0]}>
                          {`${item[1]}`}
                        </option>
                      )
                    }
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Field name="individual[dob][year]" label="Year" type="number" defaultValue={account.data.individual && account.data.individual.dob && account.data.individual.dob.year} />
            </Grid>
          </Grid>
        </fieldset>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            <Typography>
              <FormattedMessage id="account-details-address" defaultMessage="Address information" />
            </Typography>
          </legend>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Field name="individual[address][line1]" label="Address line 1" defaultValue={account.data.individual && account.data.individual.address.line1} />          
            </Grid>
            <Grid item xs={12} md={6}>
              <Field name="individual[address][line2]" label="Address line 2" defaultValue={account.data.individual && account.data.individual.address.line2} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field name="individual[address][city]" label="City" defaultValue={account.data.individual && account.data.individual.address.city} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Field name="individual[address][state]" label="State" defaultValue={account.data.individual && account.data.individual.address.state} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field name="individual[address][postal_code]" label="Postal code" defaultValue={account.data.individual && account.data.individual.address.postal_code} />
            </Grid>
          </Grid>
        </fieldset>
        <Grid item xs={12}>
          <div style={{ float: 'right' }}>
            <Button
              color='primary'
              //onClick={closeUpdateModal}
            >
              <FormattedMessage id='account.actions.cancel' defaultMessage='Cancel' />
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
            >
              <FormattedMessage id='account.actions.update' defaultMessage='Update Account' />
            </Button>
          </div>
        </Grid>
      </Grid>
      </Grid>
    </form>
  );
}

export default injectIntl(withStyles(styles)(AccountDetails));