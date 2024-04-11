import React, { useEffect, useState } from 'react'
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl'
import ReactPlaceholder from 'react-placeholder'
import {
  Paper,
  withStyles,
  Grid,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Input,
  Select,
  FormHelperText,
} from '@material-ui/core'

import MuiAlert from '@material-ui/lab/Alert'
import 'react-phone-number-input/style.css'
import MaskedInput from 'react-text-mask'
import Moment from 'moment'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import CountryPicker from './country-picker'
import { countryCodes } from './country-codes'

import messages from './messages'

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

type FieldProps = {
  name: string,
  label: string,
  type?: string,
  required?: boolean,
  defaultValue?: string,
  value?: string,
  placeholder?: string,
  disabled?: boolean,
  help?: boolean,
  inputComponent?: any
  ref?: React.Ref<HTMLElement> | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Field = ({ ref, name, value, label, type = 'text', required = false, defaultValue, placeholder, disabled, help, inputComponent, onChange }: FieldProps) => {
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel
        htmlFor={name}
      >
        {label}
      </InputLabel>
      <Input
        ref={ref}
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        value={value}
        fullWidth
        style={{ width: '100%' }}
        placeholder={placeholder}
        disabled={disabled}
        inputComponent={inputComponent}
        onChange={onChange}
      />
      {help &&
        <FormHelperText id='component-helper-text'>
          <FormattedMessage id='validation-message' defaultMessage='+Country code and Number' />
        </FormHelperText>
      }
    </FormControl>
  )
}

const AccountDetails = ({
  intl,
  account,
  updateAccount,
  user,
  createAccount,
  fetchAccount,
  classes
}) => {
  const [accountData, setAccountData] = useState({})
  const [displayCurrentCountry, setDisplayCurrentCountry] = useState({ country: '', code: '' })
  const [userId] = useState('')
  const [openCountryPicker, setOpenCountryPicker] = useState(false)
  const [terms, setTerms] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!e.target) return false
    let formData = {
      'business_profile[url]': e.target['business_profile[url]'].value,
      'individual[phone]': e.target['individual[phone]'].value,
      'individual[email]': user.user.email,
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

    if (terms) {
      formData['tos_acceptance[date]'] = Math.round(+new Date() / 1000)
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

  const Alert = (props) => {
    return <MuiAlert elevation={2} variant='outlined' {...props} />
  }

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null)
        }}
        mask={['(', '+', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
      />
    )
  }

  useEffect(() => {
    if (user.user.id) {
      const userId = user.user.id
      fetchAccount(userId)
    }
  }, [user])

  const closeCountryPicker = (e, country) => {
    setDisplayCurrentCountry(country)
    setOpenCountryPicker(false)
  }

  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <form
        onSubmit={handleSubmit}
        onChange={onChange}
        style={{ marginTop: 20, marginBottom: 20, width: '100%' }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant='h6' gutterBottom>
              <FormattedMessage id='account-details-personal-information-title' defaultMessage='Account details' />
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <ReactPlaceholder
              showLoadingAnimation
              type='media'
              rows={1}
              ready={account.completed}
            >
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  <Typography>
                    <FormattedMessage id='account-details-country-information-title' defaultMessage='Country' />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  {displayCurrentCountry.country &&
                    <Grid item xs={12} md={12}>
                      <Alert severity='info'>
                        <FormattedMessage id='account-details-country-information-desc' defaultMessage='Please make sure you have bank account on the country selected before continue.' />
                      </Alert>
                    </Grid>
                  }
                  {account && account.data.country
                    ? <Grid item xs={12} md={12}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
                        <img width='48' src={require(`../../images/countries/${countryCodes.find(c => c.code === account.data.country).image}.png`).default || require(`../../images/countries/${countryCodes.find(c => c.code === account.data.country).image}.png`)} />
                        <Typography component='span' style={{ marginLeft: 10 }}>
                          {countryCodes.find(c => c.code === account.data.country).country}
                        </Typography>
                      </div>
                    </Grid>
                    : <div>
                      <Button variant='outlined' onClick={() => setOpenCountryPicker(true)} style={{ margin: 20 }}>
                        <FormattedMessage id='account-details-country-information-action' defaultMessage='Select Country' />
                      </Button>
                      <CountryPicker open={openCountryPicker} onClose={closeCountryPicker} classes={classes} />
                    </div>
                  }
                  <code style={{ display: 'none' }}>{account && JSON.stringify(account.data)}</code>
                </Grid>
                {displayCurrentCountry.country ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
                        <img width='48' src={require(`../../images/countries/${countryCodes.find(c => c.code === displayCurrentCountry.code).image}.png`).default || require(`../../images/countries/${countryCodes.find(c => c.code === displayCurrentCountry.code).image}.png`)} />
                        <Typography component='span' style={{ marginLeft: 10 }}>
                          {countryCodes.find(c => c.code === displayCurrentCountry.code).country}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={12} justifyContent='flex-end' alignContent='flex-end' style={{display: 'flex'}}>
                      <Button variant='contained' color='primary' onClick={() => {
                        displayCurrentCountry.code && createAccount(displayCurrentCountry.code)
                        setDisplayCurrentCountry({ country: '', code: '' })
                      }} style={{ margin: 20 }}>
                        <FormattedMessage id='account-details-country-information-save' defaultMessage='Save Country and continue' />
                      </Button>
                    </Grid>
                  </Grid>
                ) : ('')}
              </fieldset>
            </ReactPlaceholder>
          </Grid>
          {account.completed && account.data.country && (
            <Grid item xs={12} md={12}>
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  <Typography>
                    <FormattedMessage id='account-details-personal-information' defaultMessage='Personal details' />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormattedMessage id='account.verify.firstName' defaultMessage='First name'>
                      {(msg) => (
                        <Field
                          name='individual[first_name]'
                          label={msg}
                          defaultValue={accountData['individual[first_name]'] || account.data.individual && account.data.individual.first_name}
                        />
                      )}
                    </FormattedMessage>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormattedMessage id='account.verify.lastName' defaultMessage='Last name'>
                      {(msg) => (
                        <Field
                          name='individual[last_name]'
                          label={msg}
                          defaultValue={accountData['individual[last_name]'] || account.data.individual && account.data.individual.last_name}
                        />
                      )}
                    </FormattedMessage>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      name='individual[id_number]'
                      label='ID number'
                      placeholder={
                        account.data.individual && account.data.individual
                          .id_number_provided
                          ? intl.formatMessage(messages.documentProvided)
                          : intl.formatMessage(messages.documentProvide)
                      }
                      disabled={
                        accountData['individual[id_number]'] || account.data.individual && account.data.individual.id_number_provided
                      }
                      defaultValue={
                        accountData['individual[id_number]'] || account.data.individual && account.data.individual.id_number
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <FormattedMessage id='account.verify.phone_number' defaultMessage='Phone number'>
                      {
                        (msg) => (
                          <Field
                            name='individual[phone]'
                            label={msg}
                            defaultValue={accountData['individual[phone]'] || account.data.individual && account.data.individual.phone}
                            help
                            inputComponent={TextMaskCustom}
                          />
                        )}
                    </FormattedMessage>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <FormattedMessage id='account.verify.business_profile_url' defaultMessage='Website'>
                      {(msg) => (
                        <Field
                          name='business_profile[url]'
                          label={msg}
                          defaultValue={accountData['business_profile[url]'] || account.data.business_profile && account.data.business_profile.url}
                        />
                      )}
                    </FormattedMessage>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography color='textPrimary' style={{ marginBottom: -20, marginTop: 10 }}>
                      <FormattedMessage id='account-details-personal-information-birth-date' defaultMessage='Birth date' />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field name='individual[dob][day]' label='Day' type='number' defaultValue={accountData['individual[dob][day]'] || account.data.individual && account.data.individual.dob && account.data.individual.dob.day} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl style={{ width: '100%' }}>
                      <Select
                        autoWidth
                        native
                        name='individual[dob][month]'
                        style={{ marginRight: 8, marginTop: 16, width: '100%' }}
                      >
                        <FormattedMessage id='account.details.month' defaultMessage='Month of birth'>{(msg) => <option value='' key={'default'}>{msg}</option>}</FormattedMessage>
                        {[[1, 'Jan'], [2, 'Fev'], [3, 'Mar'], [4, 'Apr'], [5, 'May'], [6, 'June'], [7, 'Jul'], [8, 'Aug'], [9, 'Set'], [10, 'Oct'], [11, 'Nov'], [12, 'Dec']].map(
                          (item, i) => {
                            return (
                              <option selected={account.data.individual && !!(item[0] === account.data.individual.dob.month || item[1] === accountData['individual[dob][month]'])} key={i} value={item[0]}>
                                {`${item[1]}`}
                              </option>
                            )
                          }
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field name='individual[dob][year]' label='Year' type='number' defaultValue={accountData['individual[dob][year]'] || account.data.individual && account.data.individual.dob && account.data.individual.dob.year} />
                  </Grid>
                </Grid>
              </fieldset>
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  <Typography>
                    <FormattedMessage id='account-details-address' defaultMessage='Address information' />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Field name='individual[address][line1]' label='Address line 1' defaultValue={accountData['individual[address][line1]'] || account.data.individual && account.data.individual.address.line1} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field name='individual[address][line2]' label='Address line 2' defaultValue={accountData['individual[address][line2]'] || account.data.individual && account.data.individual.address.line2} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field name='individual[address][city]' label='City' defaultValue={accountData['individual[address][city]'] || account.data.individual && account.data.individual.address.city} />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field name='individual[address][state]' label='State' defaultValue={accountData['individual[address][state]'] || account.data.individual && account.data.individual.address.state} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field name='individual[address][postal_code]' label='Postal code' defaultValue={accountData['individual[address][postal_code]'] || account.data.individual && account.data.individual.address.postal_code} />
                  </Grid>
                </Grid>
              </fieldset>
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  <Typography>
                    <FormattedMessage id='account.details.terms' defaultMessage='Accept terms' />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    {!account.data.tos_acceptance.date ? (
                      <>
                        <FormControl>
                          <FormattedMessage
                            id='account.details.terms.read'
                            defaultMessage='I read and I accept the Stripe terms to receive transfers about payments directly on my account'
                          >
                            {(msg) => (
                              <FormControlLabel
                                control={
                                  <Switch
                                    name='tos_acceptance'
                                    checked={terms}
                                    onChange={() => setTerms(!terms)}
                                    value={terms}
                                    color='primary'
                                  />
                                }
                                label={msg}
                              />
                            )}
                          </FormattedMessage>
                        </FormControl>
                        <FormControl>
                          <Typography color='primary' style={{ marginTop: 8 }}>
                            <a
                              target='_blank'
                              href={`https://stripe.com/${user.user.country}/connect-account/legal`}
                            >
                              {' '}
                              <FormattedMessage id='account.details.terms.access' defaultMessage='see stripe terms' />{' '}
                            </a>
                          </Typography>
                        </FormControl>
                      </>
                    ) : (
                      <FormControl style={{ display: 'block' }}>
                        <Typography color='primary' style={{ display: 'block' }}>
                          <FormattedMessage id='account.terms.accepted' defaultMessage='You agreed with the terms in ' />
                          {' '}
                          <FormattedDate value={Moment.unix(
                            account.data.tos_acceptance.date
                          )} />
                        </Typography>
                      </FormControl>
                    )}
                  </Grid>
                </Grid>
              </fieldset>
              <Grid item xs={12}>
                <div style={{ float: 'right' }}>
                  <Button
                    color='primary'
                  // onClick={closeUpdateModal}
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
            </Grid>)}
        </Grid>
      </form>
    </Paper>
  )
}

export default injectIntl(withStyles(styles)(AccountDetails))
