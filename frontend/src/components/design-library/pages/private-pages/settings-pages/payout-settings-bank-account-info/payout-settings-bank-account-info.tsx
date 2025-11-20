import React from 'react'
import BankAccountForm from '../../../../organisms/forms/bank-account-forms/bank-account-form/bank-account-form'

const PayoutSetingsBankAccountHolder = ({
  user,
  bankAccount,
  countries,
  onSubmit,
  onChangeBankCode,
}) => {
  return (
    <BankAccountForm
      bankAccount={bankAccount}
      user={user}
      countries={countries}
      onSubmit={onSubmit}
      onChangeBankCode={onChangeBankCode}
    />
  )
}

export default PayoutSetingsBankAccountHolder
