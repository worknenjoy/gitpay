import React from 'react'
import AccountDetailsForm from '../../../../organisms/forms/account-forms/account-details-form/account-details-form'
import AccountDetailsFormWhop from '../../../../organisms/forms/account-forms/account-details-form-whop/account-details-form-whop'

const resolveProvider = (account: any): 'stripe' | 'whop' => {
  if (account?.data?.provider === 'whop') return 'whop'
  if (account?.data?.provider === 'stripe') return 'stripe'
  const env =
    (typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER) || 'stripe'
  return env === 'whop' ? 'whop' : 'stripe'
}

/**
 * Account holder details tab.
 * Stripe: existing Connect individual/business form (unchanged).
 * Whop: read-only connected company summary + complete verification on Whop.
 */
const PayoutSetingsBankAccountHolder = ({
  user,
  account,
  countries,
  onSubmit,
  onChange,
  onConfirmCloseAccount,
  onCompleteVerification,
  /** Force a provider for this tab (Stripe tab passes 'stripe'); falls back to auto-detect */
  provider: providerProp
}) => {
  const provider = providerProp || resolveProvider(account)

  if (provider === 'whop') {
    return (
      <AccountDetailsFormWhop
        user={user}
        account={account}
        countries={countries}
        onConfirmCloseAccount={onConfirmCloseAccount}
        onCompleteVerification={onCompleteVerification}
      />
    )
  }

  return (
    <AccountDetailsForm
      user={user}
      account={account}
      countries={countries}
      onSubmit={onSubmit}
      onChange={onChange}
      onConfirmCloseAccount={onConfirmCloseAccount}
      onCompleteVerification={onCompleteVerification}
    />
  )
}

export default PayoutSetingsBankAccountHolder
