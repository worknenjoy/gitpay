import React, { useEffect } from 'react'
import Radios from 'design-library/atoms/inputs/radios/radios'
import { FormattedMessage } from 'react-intl'
import Typography from '@mui/material/Typography'
import SelectInput from 'design-library/atoms/inputs/select-inputs/select-input/select-input'
import Button from 'design-library/atoms/buttons/button/button'
import ProfileSecondaryHeader from 'design-library/molecules/headers/profile-secondary-header/profile-secondary-header'
import { RightActions, AutomaticOptions } from './payout-schedule-form.styles'

const PayoutScheduleForm = ({ completed = true, value, onSubmit }) => {
  const [automaticPayoutOptions, setAutomaticPayoutOptions] = React.useState(false)
  const [currentSelectValue, setCurrentSelectValue] = React.useState(value || 'daily')
  const [currentRadioValue, setCurrentRadioValue] = React.useState(value || 'automatic')
  const [currentValue, setCurrentValue] = React.useState(value || 'daily')

  const handlePayoutScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === 'automatic') {
      setAutomaticPayoutOptions(true)
      setCurrentRadioValue('automatic')
      setCurrentValue('daily')
      setCurrentSelectValue('daily') // Default to daily if automatic is selected
    }
    if (value === 'manual') {
      setAutomaticPayoutOptions(false)
      setCurrentRadioValue('manual')
      setCurrentSelectValue(null)
      setCurrentValue(value)
    }
  }

  useEffect(() => {
    if (value === 'manual') {
      setCurrentRadioValue('manual')
      setCurrentSelectValue(null)
    }
    if (value === 'daily' || value === 'weekly' || value === 'monthly') {
      setCurrentRadioValue('automatic')
      setCurrentSelectValue(value)
      setAutomaticPayoutOptions(true)
      setCurrentValue(value)
    }
  }, [value])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(event, currentValue)
  }

  const handleSelectChange = (event) => {
    setCurrentSelectValue(event.target.value)
    setCurrentValue(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <ProfileSecondaryHeader
        title={
          <FormattedMessage
            id="payout-schedule.settings.title"
            defaultMessage="Payout Schedule Settings"
          />
        }
        subtitle={
          <FormattedMessage
            id="payout-schedule.settings.description"
            defaultMessage="Configure your payout schedule preferences."
          />
        }
      />
      <Radios
        completed={completed}
        onChange={handlePayoutScheduleChange}
        name={'payoutSchedule'}
        label={
          <FormattedMessage
            id="payoutSchedule.frequency"
            defaultMessage="Your payout schedule determines when Gitpay sends money to your registered bank account."
          />
        }
        value={currentRadioValue}
        options={[
          {
            value: 'manual',
            label: (
              <FormattedMessage
                id="payout.settings.schedule.manual"
                defaultMessage="Manual Payouts"
              />
            ),
            caption: (
              <FormattedMessage
                id="payout.settings.schedule.manual.caption"
                defaultMessage="You can manually initiate a payout from Gitpay whenever you want."
              />
            ),
          },
          {
            value: 'automatic',
            label: (
              <FormattedMessage
                id="payout.settings.schedule.automatic"
                defaultMessage="Automatic Payouts"
              />
            ),
            caption: (
              <FormattedMessage
                id="payout.settings.schedule.automatic.caption"
                defaultMessage="Gitpay will automatically payout funds to your bank account based on the selected schedule."
              />
            ),
            content: automaticPayoutOptions && (
              <AutomaticOptions>
                <Typography variant="caption">
                  <FormattedMessage
                    id="payoutSchedule.automaticOptions"
                    defaultMessage="Set a custom schedule to payout funds to your bank account."
                  />
                </Typography>
                <div>
                  <SelectInput
                    options={[
                      {
                        value: 'daily',
                        label: (
                          <FormattedMessage
                            id="payoutSchedule.automatic.daily"
                            defaultMessage="Daily"
                          />
                        ),
                      },
                      {
                        value: 'weekly',
                        label: (
                          <FormattedMessage
                            id="payoutSchedule.automatic.weekly"
                            defaultMessage="Weekly"
                          />
                        ),
                      },
                      {
                        value: 'monthly',
                        label: (
                          <FormattedMessage
                            id="payoutSchedule.automatic.monthly"
                            defaultMessage="Monthly"
                          />
                        ),
                      },
                    ]}
                    value={currentSelectValue}
                    onChange={handleSelectChange}
                    completed={completed}
                  />
                </div>
              </AutomaticOptions>
            ),
          },
        ]}
      />
      <RightActions>
        <Button
          completed={completed}
          variant="contained"
          color="secondary"
          type="submit"
          label={
            <FormattedMessage id="payoutSchedule.save" defaultMessage="Save Payout Schedule" />
          }
        />
      </RightActions>
    </form>
  )
}

export default PayoutScheduleForm
