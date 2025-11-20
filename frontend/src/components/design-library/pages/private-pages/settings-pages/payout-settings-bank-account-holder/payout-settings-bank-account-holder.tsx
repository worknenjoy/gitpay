import React from 'react'
import AccountDetailsForm from '../../../../organisms/forms/account-forms/account-details-form/account-details-form'

const PayoutSetingsBankAccountHolder = ({
  account,
  countries,
  onSubmit,
  onChange,
  onConfirmCloseAccount
}) => {
  return (
    <>
      <AccountDetailsForm
        account={account}
        countries={countries}
        onSubmit={onSubmit}
        onChange={onChange}
        onConfirmCloseAccount={onConfirmCloseAccount}
      />
    </>
  )
}

export default PayoutSetingsBankAccountHolder
