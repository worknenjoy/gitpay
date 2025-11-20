import React, { useState } from 'react'
import PayoutSettingsBankAccountHolder from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-holder/payout-settings-bank-account-holder'

const BankAccountHolderPage = ({ user, account, countries, updateAccount, deleteAccount }) => {
  const { data, completed } = account
  const [terms, setTerms] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email } = user

    if (!e.target) return false
    let formData = {
      country: e.target['account_country'].value,
      default_currency: e.target['account_currency'].value,
      'business_profile[url]': e.target['website'].value,
      'individual[phone]': e.target['phone_number'].value,
      'individual[email]': email,
      'individual[first_name]': e.target['first_name'].value,
      'individual[last_name]': e.target['last_name'].value,
      'individual[address][city]': e.target['city'].value,
      'individual[address][line1]': e.target['address_line_1'].value,
      'individual[address][line2]': e.target['address_line_2'].value,
      'individual[address][postal_code]': e.target['postal_code'].value,
      'individual[address][state]': e.target['state'].value,
      'individual[dob][day]': e.target['dob_day'].value,
      'individual[dob][month]': e.target['dob_month'].value,
      'individual[dob][year]': e.target['dob_year'].value
    }

    if (terms) {
      formData['tos_acceptance[date]'] = Math.round(+new Date() / 1000)
    }

    if (e.target['individual[id_number]'].value) {
      formData['individual[id_number]'] = e.target['individual[id_number]'].value
    }
    await updateAccount(formData)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <PayoutSettingsBankAccountHolder
      account={account}
      countries={countries}
      onSubmit={handleSubmit}
      onChange={setTerms}
      onConfirmCloseAccount={deleteAccount}
    />
  )
}
export default BankAccountHolderPage
