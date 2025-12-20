import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Paper, Button, Typography, Input, Select } from '@mui/material'
import { StyledFieldset, StyledLegend } from './account-customer-form.styles'
import Field from 'design-library/atoms/inputs/fields/field/field'

import { countryCodesFull } from '../../../../../areas/private/shared/country-codes'

const AccountCustomerForm = ({ customer, customerData, user, handleSubmit, onChange }) => {
  const intl = useIntl()
  const { data } = user

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <form onSubmit={handleSubmit} onChange={onChange} style={{ width: '100%' }}>
        <Grid container spacing={2}>
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
                    id="account.customer.actions.save"
                    defaultMessage="Save invoice settings"
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

export default AccountCustomerForm
