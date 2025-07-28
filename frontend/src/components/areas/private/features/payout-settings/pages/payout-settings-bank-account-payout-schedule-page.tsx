import PayoutScheduleForm from 'design-library/organisms/forms/payout-forms/payout-schedule-form/payout-schedule-form';
import React, { useEffect } from 'react';

const PayoutSettingsBankAccountPayoutSchedulePage = ({
  user,
  account,
  updateAccount
}) => {
  const { data, completed } = account || {};
  const { settings = {} } = data || {};
  const { payouts } = settings || {};
  const { schedule } = payouts || {};
  const { interval } = schedule || {};

  useEffect(() => {
   console.log(user, account, updateAccount);
  }, [user, account, updateAccount]);
  
  return (
    <div>
      <PayoutScheduleForm
        completed={completed}
        value={interval}
        onSubmit={updateAccount}
      />
    </div>
  );
};

export default PayoutSettingsBankAccountPayoutSchedulePage;
