import React from 'react'
import PayoutSettingsBankAccountInfo from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-info/payout-settings-bank-account-info'

const PayoutSettingsBankAccountInfoPage = ({
  user,
  bankAccount,
  updateBankAccount,
  createBankAccount,
  deleteBankAccount,
  getBankAccount,
  countries
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
    e.preventDefault()
    return {
      ...(routingNumberValue ? { routing_number: routingNumberValue } : undefined),
      account_number: e.target['account_number'].value,
      country: e.target['bank_account_country'].value,
      account_holder_name: e.target['account_holder_name'].value,
      account_holder_type: e.target['bank_account_type'].value,
      currency: e.target['bank_account_currency'].value
      //'external_account[bank_name]': e.target['bankCode'].value
    }
  }

  const onCreateSubmit = async (e) => {
    await createBankAccount(toFormData(e))
    await getBankAccount?.()
  }

  const onEditSubmit = async (account, e) => {
    await updateBankAccount({ id: account.id, ...toFormData(e) })
    await getBankAccount?.()
  }

  const onDelete = async (account) => {
    await deleteBankAccount?.(account.id)
    await getBankAccount?.()
  }

  return (
    <div>
      <PayoutSettingsBankAccountInfo
        user={user}
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
