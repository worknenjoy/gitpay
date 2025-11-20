import React from 'react'
import { Grid } from '@mui/material'
import Fieldset from '../../../atoms/inputs/fieldset/fieldset'
import Field from '../../../atoms/inputs/fields/field/field'

const AddressInformationForm = ({
  completed,
  addressLine1,
  addressLine2,
  city,
  state,
  zipCode,
  country,
}) => {
  return (
    <Fieldset completed={completed} legend="Address Information">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Field
            label="Address Line 1"
            name="address_line_1"
            type="text"
            placeholder="Enter your address line 1"
            defaultValue={addressLine1}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Field
            label="Address Line 2"
            name="address_line_2"
            type="text"
            placeholder="Enter your address line 2"
            defaultValue={addressLine2}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Field
            label="City"
            name="city"
            type="text"
            placeholder="Enter your city"
            defaultValue={city}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Field
            label="State"
            name="state"
            type="text"
            placeholder="Enter your state"
            defaultValue={state}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Field
            label="Zip Code"
            name="postal_code"
            type="text"
            placeholder="Enter your zip code"
            defaultValue={zipCode}
          />
        </Grid>
      </Grid>
    </Fieldset>
  )
}
export default AddressInformationForm
