import React from 'react'
import PayoutSettingsBankAccountInfo from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-info/payout-settings-bank-account-info'

const PayoutSettingsBankAccountInfoPage = ({
  user,
  bankAccount,
  updateBankAccount,
  createBankAccount,
  countries,
}) => {
  const [bankCode, setBankCode] = React.useState(null)

  const handleBankCodeChange = (code) => {
    setBankCode(code)
  }

  const onUpdateBankAccount = async (e) => {
    const routingNumberField = e.target['routing_number']
    const routingNumberValue = bankCode
      ? `${bankCode}-${routingNumberField?.value}`
      : routingNumberField?.value
    e.preventDefault()
    let formData = {
      ...(routingNumberValue ? { routing_number: routingNumberValue } : undefined),
      account_number: e.target['account_number'].value,
      country: e.target['bank_account_country'].value,
      account_holder_name: e.target['account_holder_name'].value,
      account_holder_type: e.target['bank_account_type'].value,
      currency: e.target['bank_account_currency'].value,
      //'external_account[bank_name]': e.target['bankCode'].value
    }

    if (bankAccount?.data?.id) {
      await updateBankAccount(formData)
    } else {
      await createBankAccount(formData)
    }
  }

  return (
    <div>
      <PayoutSettingsBankAccountInfo
        user={user}
        bankAccount={bankAccount}
        onSubmit={onUpdateBankAccount}
        countries={countries}
        onChangeBankCode={handleBankCodeChange}
      />
    </div>
  )
}
export default PayoutSettingsBankAccountInfoPage
