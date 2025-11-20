import React from 'react'
import PayoutSettingsPaypal from 'design-library/pages/private-pages/settings-pages/payout-settings-paypal/payout-settings-paypal'

const PayoutSettingsPaypalPage = ({ user, updateUser }) => {
  const handlePaypalAccount = (e) => {
    e.preventDefault()
    updateUser({
      paypal_id: e.target.paypal_email.value
    })
  }

  return <PayoutSettingsPaypal user={user} onSubmit={handlePaypalAccount} />
}
export default PayoutSettingsPaypalPage
