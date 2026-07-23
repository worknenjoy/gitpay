import React from 'react'
import AccountDetailsForm from '../../../../organisms/forms/account-forms/account-details-form/account-details-form'

const PayoutSetingsBankAccountHolder = ({
  user,
  account,
  countries,
  onSubmit,
  onChange,
  onConfirmCloseAccount,
  onCompleteVerification
}) => {
  return (
    <>
      <AccountDetailsForm
        user={user}
        account={account}
        countries={countries}
        onSubmit={onSubmit}
        onChange={onChange}
        onConfirmCloseAccount={onConfirmCloseAccount}
        onCompleteVerification={onCompleteVerification}
      />
    </>
  )
}

export default PayoutSetingsBankAccountHolder
