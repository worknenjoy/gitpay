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
  Options,
  FormHelperText,
} from '@material-ui/core'

import { countryCodesFull } from '../../../../shared/country-codes'

const styles = (theme) => ({
  legend: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.palette.primary.dark,
  },
  fieldset: {
    border: `1px solid ${theme.palette.primary.light}`,
    marginBottom: 20,
    '&[disabled] legend': {
      color: theme.palette.primary.light,
    }
  }
})

type FieldProps = {
  name: string,
  label: string | React.ReactNode,
  type?: string,
  required?: boolean,
  defaultValue?: string,
  value?: string,
  placeholder?: string,
  disabled?: boolean,
  help?: boolean,
  inputComponent?: any
  ref?: React.Ref<HTMLElement> | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  completed?: boolean
}

export const Field = ({ ref, name, value, label, type = 'text', required = false, defaultValue, placeholder, disabled, help, inputComponent, onChange, completed }: FieldProps) => {
  return (
    <FormControl style={{ width: '100%' }}>
       <ReactPlaceholder
          type='text'
          rows={1}
          ready={completed}
      >
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
      </ReactPlaceholder>
    </FormControl>
  )
}

const CustomerDetails = ({
  intl,
  customer,
  fetchCustomer,
  createCustomer,
  updateCustomer,
  user,
  classes
}) => {
  const [customerData, setCustomerData] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!e.target) return false
    let formData = {
      name: e.target['name'].value,
      email: user.user.email,
      address: {
        city: e.target['address[city]'].value,
        country: e.target['address[country]'].value,
        line1: e.target['address[line1]'].value,
        line2: e.target['address[line2]'].value,
        postal_code: e.target['address[postal_code]'].value,
        state: e.target['address[state]'].value
      },
      metadata: {
        user_id: user.user.id,
        //customer_type: e.target['customer_type'].value
      }
    }
    setCustomerData(formData)
    if (!user.user.customer_id) {
      await createCustomer(formData)
    } else {
      await updateCustomer(formData)
    }
  }
  const onChange = (e) => {
    e.preventDefault()
    if (!e.target) return false
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value || e.target.options[e.target.selectedIndex].value
    })
  }

  useEffect(() => {
    if (user.user.id) {
      const userId = user.user.id
      fetchCustomer(userId)
    }
  }, [user, createCustomer, updateCustomer])

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
              <FormattedMessage id='account.customer.title' defaultMessage='Billing information' />
            </Typography>
          </Grid>
          
            <Grid item xs={12} md={12}>
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  <Typography>
                    <FormattedMessage id='customer.personal.title' defaultMessage='1. Personal / business details' />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormattedMessage id='customer.verify.fullName' defaultMessage='Full name / Business name'>
                      {(msg) => (
                        <Field
                          name='name'
                          label={msg}
                          defaultValue={customer.data.name}
                          value={customerData['name']}
                          completed={customer.completed}
                        />
                      )}
                    </FormattedMessage>
                  </Grid>
                </Grid>
              </fieldset>
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  <Typography>
                    <FormattedMessage id='account-details-address' defaultMessage='2. Address information' />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Field name='address[line1]' label='Address line 1' value={customerData['address[line1]']} defaultValue={customer.data.address?.line1} completed={customer.completed} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field name='address[line2]' label='Address line 2' value={customerData['address[line2]']} defaultValue={customer.data.address?.line2} completed={customer.completed} />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field name='address[postal_code]' label='Postal code' value={customerData['address[postal_code]']} defaultValue={customer.data.address?.postal_code} completed={customer.completed} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field name='address[city]' label='City' value={customerData['address[city]']} defaultValue={customer.data.address?.city} completed={customer.completed} />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field name='address[state]' label='State' value={customerData['address[state]']} defaultValue={customer.data.address?.state} completed={customer.completed} />
                  </Grid>
                   <Grid item xs={12} md={4}>
                    <ReactPlaceholder
                      type='text'
                      rows={1}
                      ready={customer.completed}
                    >
                      <Select
                        native
                        name='address[country]'
                        value={customerData['address[country]']}
                        input={<Input id='address-country' />}
                        fullWidth
                        style={{ marginTop: 16 }}
                      >
                        <option value=''>
                          Select country
                        </option>
                        {countryCodesFull.map((c, index) => (
                          <option key={index} value={c.code} selected={customer.data.address?.country === c.code}>{c.country}</option>
                        ))}
                      </Select>
                    </ReactPlaceholder>
                  </Grid>
                </Grid>
              </fieldset>
              <Grid item xs={12}>
                <div style={{ float: 'right' }}>
                  <Button
                    variant='text'
                    style={{ marginRight: 10 }}
                  >
                    <FormattedMessage id='account.actions.cancel' defaultMessage='Cancel' />
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                  >
                    <FormattedMessage id='customer.actions.save' defaultMessage='Save payment information' />
                  </Button>
                </div>
              </Grid>
            </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default injectIntl(withStyles(styles)(CustomerDetails))
