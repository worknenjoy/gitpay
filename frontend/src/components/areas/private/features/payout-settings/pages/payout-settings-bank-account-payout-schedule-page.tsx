import PayoutScheduleForm from 'design-library/organisms/forms/payout-forms/payout-schedule-form/payout-schedule-form'
import React from 'react'

const PayoutSettingsBankAccountPayoutSchedulePage = ({ account, updateAccount }) => {
  const { data, completed } = account || {}
  const { settings = {} } = data || {}
  const { payouts } = settings || {}
  const { schedule } = payouts || {}
  const { interval } = schedule || {}

  /*
  useEffect(() => {
   console.log(account, updateAccount);
  }, [account, updateAccount]);
  */

  const handlePayoutScheduleUpdate = (event, value) => {
    event.preventDefault()

    const formData = {
      'settings[payouts][schedule][interval]': value,
      ...(value === 'weekly' ? { 'settings[payouts][schedule][weekly_anchor]': 'monday' } : {}),
      ...(value === 'monthly' ? { 'settings[payouts][schedule][monthly_anchor]': '1' } : {}),
    }
    updateAccount(formData)
  }

  return (
    <div>
      <PayoutScheduleForm
        completed={completed}
        value={interval}
        onSubmit={handlePayoutScheduleUpdate}
      />
    </div>
  )
}

export default PayoutSettingsBankAccountPayoutSchedulePage
