import React, { useEffect } from 'react'
import PayoutSettingsBankAccountInfo from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-info/payout-settings-bank-account-info'

const PayoutSettingsBankAccountInfoPage = ({
  user,
  account,
  bankAccount,
  getBankAccount,
  updateBankAccount,
  createBankAccount,
  deleteBankAccount,
  countries,
  fetchAccount,
  fetchAccountCountries
}) => {
  const [bankCode, setBankCode] = React.useState(null)

  const handleBankCodeChange = (code) => {
    setBankCode(code)
  }

  const toFormData = (e) => {
    const routingNumberField = e.target['routing_number']
    const routingNumberValue = bankCode
      ? `${bankCode}-${routingNumberField?.value}`
      : routingNumberField?.value
    return {
      ...(routingNumberValue ? { routing_number: routingNumberValue } : undefined),
      account_number: e.target['account_number'].value,
      country: e.target['bank_account_country'].value,
      account_holder_name: e.target['account_holder_name'].value,
      account_holder_type: e.target['bank_account_type'].value,
      currency: e.target['bank_account_currency'].value,
      default_for_currency: e.target['default_for_currency']?.checked
      //'external_account[bank_name]': e.target['bankCode'].value
    }
  }

  const onCreateSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    return await createBankAccount(toFormData(e))
  }

  const onEditSubmit = async (account, e) => {
    e.preventDefault()
    e.stopPropagation()
    return await updateBankAccount({ id: account.id, ...toFormData(e) })
  }

  const onDelete = async (account) => {
    await deleteBankAccount?.(account.id)
  }

  useEffect(() => {
    getBankAccount()
    fetchAccount && fetchAccount()
    fetchAccountCountries && fetchAccountCountries()
  }, [getBankAccount, fetchAccount, fetchAccountCountries])

  return (
    <div>
      <PayoutSettingsBankAccountInfo
        provider="stripe"
        user={user}
        account={account}
        bankAccount={bankAccount}
        onCreateSubmit={onCreateSubmit}
        onEditSubmit={onEditSubmit}
        onDelete={onDelete}
        countries={countries}
        onChangeBankCode={handleBankCodeChange}
      />
    </div>
  )
}
export default PayoutSettingsBankAccountInfoPage
