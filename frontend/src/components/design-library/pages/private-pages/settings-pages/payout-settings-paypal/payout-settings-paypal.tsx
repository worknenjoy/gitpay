import React from 'react'
import PaypalInfoForm from '../../../../organisms/forms/payout-forms/paypal-info-form/paypal-info-form'
import ProfileHeader from '../../../../molecules/headers/profile-main-header/profile-main-header'
import { FormattedMessage } from 'react-intl'

const PayoutSettingsPaypal = ({ user, onSubmit }) => {
  return (
    <>
      <ProfileHeader
        title={
          <FormattedMessage id="payoutSettings.paypal.title" defaultMessage="PayPal Account" />
        }
        subtitle={
          <FormattedMessage
            id="payoutSettings.paypal.subtitle"
            defaultMessage="Manage your PayPal account settings."
          />
        }
      />
      <PaypalInfoForm user={user} onSubmit={onSubmit} />
    </>
  )
}

export default PayoutSettingsPaypal
