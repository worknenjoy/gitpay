import React from 'react'
import { Grid } from '@mui/material'
import Fieldset from '../../../atoms/inputs/fieldset/fieldset'
import Field from '../../../atoms/inputs/fields/field/field'
import IdNumberField from '../../../atoms/inputs/fields/id-number-field/id-number-field'
import PhoneNumberField from '../../../atoms/inputs/fields/phone-number-field/phone-number-field'
import BirthDateField from '../../../atoms/inputs/fields/birth-date-field/birth-date-field'

const PersonalDetailsForm = ({ account }) => {
  const { data = {}, completed } = account
  const { individual = {}, business_profile = {} } = data
  const { first_name = '', last_name = '', phone = '', dob = {} } = individual
  const { day = '', month = '', year = '' } = dob
  const { url = '' } = business_profile

  return (
    <Fieldset completed={completed} legend="Personal Details">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Field
            label="First Name"
            name="first_name"
            type="text"
            required
            placeholder="Enter your first name"
            defaultValue={first_name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Field
            label="Last Name"
            name="last_name"
            type="text"
            required
            placeholder="Enter your last name"
            defaultValue={last_name}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <IdNumberField account={account} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <PhoneNumberField phone={phone} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Field label="Website" name="website" defaultValue={url} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <BirthDateField day={day} month={month} year={year} />
        </Grid>
      </Grid>
    </Fieldset>
  )
}
export default PersonalDetailsForm
