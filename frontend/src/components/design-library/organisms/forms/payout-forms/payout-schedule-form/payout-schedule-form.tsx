import React from 'react';
import Radios from 'design-library/atoms/inputs/radios/radios';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography/Typography';
import SelectInput from 'design-library/atoms/inputs/select-inputs/select-input/select-input';
import Button from 'design-library/atoms/buttons/button/button';

const PayoutScheduleForm = ({ completed = true }) => {
  const [ automaticPayoutOptions, setAutomaticPayoutOptions ] = React.useState(false);
  const handlePayoutScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if(value === 'automatic') {
      setAutomaticPayoutOptions(true);
    }
  };
  return (
    <form>
      <Radios
        onChange={handlePayoutScheduleChange}
        name={'payoutSchedule'}
        label={<FormattedMessage id="payoutSchedule.frequency" defaultMessage="Payout Schedule Settings" />}
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
              value={'daily'}
              onChange={() => {}}
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