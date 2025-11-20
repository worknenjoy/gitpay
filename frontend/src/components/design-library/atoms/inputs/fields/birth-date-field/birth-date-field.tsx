import React from 'react'
import { FormControl, FormHelperText, Grid, Select, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Field from '../field/field'

const BirthDateField = ({
  day,
  month,
  year,
  error = { month: false, day: false, year: false }
}) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography color="textPrimary" style={{ marginBottom: -20, marginTop: 10 }}>
          <FormattedMessage
            id="account-details-personal-information-birth-date"
            defaultMessage="Birth date"
          />
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Field name="dob_day" label="Day" type="number" min={1} max={31} defaultValue={day} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl style={{ width: '100%' }}>
          <Select
            autoWidth
            native
            name="dob_month"
            style={{ marginRight: 8, marginTop: 16, width: '100%' }}
          >
            <FormattedMessage id="account.details.month" defaultMessage="Month of birth">
              {(msg) =>
                !month && (
                  <option value="" key={'default'}>
                    {msg}
                  </option>
                )
              }
            </FormattedMessage>
            {[
              [1, 'Jan'],
              [2, 'Feb'],
              [3, 'Mar'],
              [4, 'Apr'],
              [5, 'May'],
              [6, 'June'],
              [7, 'Jul'],
              [8, 'Aug'],
              [9, 'Set'],
              [10, 'Oct'],
              [11, 'Nov'],
              [12, 'Dec']
            ].map((item, i) => {
              return (
                <option selected={!!(item[0] === month)} key={i} value={item[0]}>
                  {`${item[1]}`}
                </option>
              )
            })}
          </Select>
          {error.month && (
            <FormHelperText error id="component-helper-text">
              <FormattedMessage
                id="validation-message"
                defaultMessage="Please select the month of birth"
              />
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Field name="dob_year" label="Year" type="number" defaultValue={year} />
      </Grid>
    </Grid>
  )
}
export default BirthDateField
