import React, { useEffect, useState } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Paper, Button, Typography, Input, Select } from '@mui/material'
import { StyledFieldset, StyledLegend } from './account-customer.styles'
import Field from '../../../../../../design-library/atoms/inputs/fields/field/field'

import { countryCodesFull } from '../../../../shared/country-codes'

// styles migrated to Styled components in account-customer.styles.ts

type FieldProps = {
  name: string
  label: string | React.ReactNode
  type?: string
  required?: boolean
  defaultValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  help?: boolean
  inputComponent?: any
  ref?: React.Ref<HTMLElement> | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  completed?: boolean
}

const CustomerDetails = ({ customer, fetchCustomer, createCustomer, updateCustomer, user }) => {
  const intl = useIntl()
  const [customerData, setCustomerData] = useState({})
  const { data } = user

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!e.target) return false
    let formData = {
      name: e.target['name'].value,
      email: data.email,
      address: {
        city: e.target['address[city]'].value,
        country: e.target['address[country]'].value,
        line1: e.target['address[line1]'].value,
        line2: e.target['address[line2]'].value,
        postal_code: e.target['address[postal_code]'].value,
        state: e.target['address[state]'].value
      },
      metadata: {
        user_id: data.id
        //customer_type: e.target['customer_type'].value
      }
    }
    setCustomerData(formData)
    if (!data.customer_id) {
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
      [e.target.name]: e.target.value || e.target.options?.[e.target.selectedIndex]?.value
    })
  }

  useEffect(() => {
    if (data.id) {
      const userId = data.id
      fetchCustomer(userId)
    }
  }, [data, createCustomer, updateCustomer, fetchCustomer])

  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <form
        onSubmit={handleSubmit}
        onChange={onChange}
        style={{ marginTop: 20, marginBottom: 20, width: '100%' }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="h6" gutterBottom>
              <FormattedMessage id="account.customer.title" defaultMessage="Billing information" />
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <StyledFieldset>
              <StyledLegend>
                <Typography>
                  <FormattedMessage
                    id="customer.personal.title"
                    defaultMessage="1. Personal / business details"
                  />
                </Typography>
              </StyledLegend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <FormattedMessage
                    id="customer.verify.fullName"
                    defaultMessage="Full name / Business name"
                  >
                    {(msg) => (
                      <Field
                        name="name"
                        label={msg}
                        defaultValue={customer.data.name}
                        value={customerData['name']}
                        completed={customer.completed}
                      />
                    )}
                  </FormattedMessage>
                </Grid>
              </Grid>
            </StyledFieldset>
            <StyledFieldset>
              <StyledLegend>
                <Typography>
                  <FormattedMessage
                    id="account-details-address"
                    defaultMessage="2. Address information"
                  />
                </Typography>
              </StyledLegend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field
                    name="address[line1]"
                    label="Address line 1"
                    value={customerData['address[line1]']}
                    defaultValue={customer.data.address?.line1}
                    completed={customer.completed}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field
                    name="address[line2]"
                    label="Address line 2"
                    value={customerData['address[line2]']}
                    defaultValue={customer.data.address?.line2}
                    completed={customer.completed}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Field
                    name="address[postal_code]"
                    label="Postal code"
                    value={customerData['address[postal_code]']}
                    defaultValue={customer.data.address?.postal_code}
                    completed={customer.completed}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field
                    name="address[city]"
                    label="City"
                    value={customerData['address[city]']}
                    defaultValue={customer.data.address?.city}
                    completed={customer.completed}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Field
                    name="address[state]"
                    label="State"
                    value={customerData['address[state]']}
                    defaultValue={customer.data.address?.state}
                    completed={customer.completed}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  {!customer.completed ? (
                    <Skeleton variant="text" animation="wave" width="100%" />
                  ) : (
                    <Select
                      native
                      name="address[country]"
                      value={customerData['address[country]']}
                      input={<Input id="address-country" />}
                      fullWidth
                      style={{ marginTop: 16 }}
                    >
                      <option value="">
                        {intl.formatMessage({
                          id: 'select.country',
                          defaultMessage: 'Select country'
                        })}
                      </option>
                      {countryCodesFull.map((c, index) => (
                        <option
                          key={index}
                          value={c.code}
                          selected={customer.data.address?.country === c.code}
                        >
                          {c.country}
                        </option>
                      ))}
                    </Select>
                  )}
                </Grid>
              </Grid>
            </StyledFieldset>
            <Grid size={{ xs: 12 }}>
              <div style={{ float: 'right' }}>
                <Button variant="text" style={{ marginRight: 10 }}>
                  <FormattedMessage id="account.actions.cancel" defaultMessage="Cancel" />
                </Button>
                <Button type="submit" variant="contained" color="secondary">
                  <FormattedMessage
                    id="customer.actions.save"
                    defaultMessage="Save payment information"
                  />
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default CustomerDetails
