import React, { useEffect } from 'react';
import Radios from 'design-library/atoms/inputs/radios/radios';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography/Typography';
import SelectInput from 'design-library/atoms/inputs/select-inputs/select-input/select-input';
import Button from 'design-library/atoms/buttons/button/button';
import ProfileSecondaryHeader from 'design-library/molecules/headers/profile-secondary-header/profile-secondary-header';

const PayoutScheduleForm = ({ completed = true, value, onSubmit }) => {
  const [ automaticPayoutOptions, setAutomaticPayoutOptions ] = React.useState(false);
  const [ currentSelectValue, setCurrentSelectValue] = React.useState(value || 'daily');
  const [ currentRadioValue, setCurrentRadioValue] = React.useState(value || 'manual');

  const handlePayoutScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if(value === 'automatic') {
      setAutomaticPayoutOptions(true);
    }
  };

  useEffect(() => {
    if(value === 'manual') {
      setCurrentRadioValue('manual');
      setCurrentSelectValue(null)
    }
    if( value === 'daily' || value === 'weekly' || value === 'monthly') {
      setCurrentRadioValue('automatic');
      setCurrentSelectValue(value);
      setAutomaticPayoutOptions(true);
    }
  }, [value]);

  return (
    <form>
      <ProfileSecondaryHeader
        title={<FormattedMessage id="payout-schedule.settings.title" defaultMessage="Payout Schedule Settings" />}
        subtitle={<FormattedMessage id="payout-schedule.settings.description" defaultMessage="Configure your payout schedule preferences." />}
      />
      <Radios
        onChange={handlePayoutScheduleChange}
        name={'payoutSchedule'}
        label={<FormattedMessage id="payoutSchedule.frequency" defaultMessage="Payout Schedule Settings" />}
        value={currentRadioValue}
        options={[
          { value: 'manual', label: <FormattedMessage id="payout.settings.schedule.manual" defaultMessage="Manual Payouts" /> },
          { value: 'automatic', label: <FormattedMessage id="payout.settings.schedule.automatic" defaultMessage="Automatic Payouts" /> }
        ]}
      />
      {automaticPayoutOptions && (
        <div>
          <Typography variant="caption" style={{ marginTop: 20 }}>
            <FormattedMessage id="payoutSchedule.automaticOptions" defaultMessage="Automatic payout options will be displayed here." />
          </Typography>
          <div>
            <SelectInput
              options={[
                { value: 'daily', label: <FormattedMessage id="payoutSchedule.automatic.daily" defaultMessage="Daily" /> },
                { value: 'weekly', label: <FormattedMessage id="payoutSchedule.automatic.weekly" defaultMessage="Weekly" /> },
                { value: 'monthly', label: <FormattedMessage id="payoutSchedule.automatic.monthly" defaultMessage="Monthly" /> }
              ]}
              value={currentSelectValue}
              onChange={(event) => setCurrentSelectValue(event.target.value)}
            />
          </div>
        </div>
      )}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          completed={completed}
          variant="contained"
          color="secondary"
          type="submit"
          label={<FormattedMessage id="payoutSchedule.save" defaultMessage="Save Payout Schedule" />}
        />
      </div>
    </form>
  );
};

export default PayoutScheduleForm;