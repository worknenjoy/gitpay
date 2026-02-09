import React from 'react'
import BankAccountsManager from '../../../../organisms/forms/bank-account-forms/bank-accounts-manager/bank-accounts-manager'

const PayoutSetingsBankAccountHolder = ({
  user,
  bankAccount,
  countries,
  onChangeBankCode,
  onCreateSubmit,
  onEditSubmit,
  onDelete
}) => {
  return (
    <BankAccountsManager
      accounts={bankAccount}
      user={user}
      countries={countries}
      onChangeBankCode={onChangeBankCode}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      onDelete={onDelete}
    />
  )
}

export default PayoutSetingsBankAccountHolder
