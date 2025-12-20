import React from 'react'
import { FormattedMessage } from 'react-intl'
import AccountCustomerForm from 'design-library/organisms/forms/account-forms/account-customer-form/account-customer-form'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'

const InvoiceSettings = ({ customer, customerData, user, handleSubmit, onChange }) => {
  return (
    <div>
      <ProfileHeader
        title={<FormattedMessage id="invoiceSettings.title" defaultMessage="Invoice Settings" />}
        subtitle={
          <FormattedMessage
            id="invoiceSettings.subtitle"
            defaultMessage="Set up your invoice settings to customize invoice details when generating invoices for payment."
          />
        }
      />
      <AccountCustomerForm
        customer={customer}
        user={user}
        handleSubmit={handleSubmit}
        onChange={onChange}
        customerData={customerData}
      />
    </div>
  )
}

export default InvoiceSettings
