import React from 'react'
import BankAccountsManager from '../../../../organisms/forms/bank-account-forms/bank-accounts-manager/bank-accounts-manager'

const normalizeAccounts = (bankAccount: any) => {
  const data = bankAccount?.data
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Object.keys(data).length > 0) return [data]
  return []
}

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
      completed={bankAccount?.completed}
      accounts={normalizeAccounts(bankAccount)}
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
