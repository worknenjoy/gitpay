import React from 'react'
import AccountDetailsForm from '../../../organisms/forms/account-details-form/account-details-form'

const PayoutSetingsBankAccountHolder = ({
  account,
  countries,
  onSubmit,
  onChange
}) => {
  return (
    <>
      <AccountDetailsForm
        account={account}
        countries={countries}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </>
  );
}

export default PayoutSetingsBankAccountHolder;