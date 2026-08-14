import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, Box, Paper, Typography, Divider } from '@mui/material'
import BankAccountsManager from '../../../../organisms/forms/bank-account-forms/bank-accounts-manager/bank-accounts-manager'
import Field from '../../../../atoms/inputs/fields/field/field'

const envPaymentProvider =
  (typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER) || 'stripe'

type PayoutSettingsBankAccountInfoProps = {
  user: any
  bankAccount?: any
  countries?: any
  account?: any
  onChangeBankCode?: (code: any) => void
  onCreateSubmit?: (e: any) => Promise<any> | void
  onEditSubmit?: (account: any, e: any) => Promise<any> | void
  onDelete?: (account: any) => Promise<any> | void
  /** Optional — used on Whop bank tab to open verification / payout portal */
  onCompleteVerification?: () => void
  /** Force a provider for this tab (Stripe tab passes 'stripe'); falls back to env */
  provider?: string
}

/**
 * Bank account information tab.
 * Stripe: manage Connect external bank accounts.
 * Whop: bank / payout method is configured on Whop (account_links); Gitpay only shows currency.
 */
const PayoutSetingsBankAccountInfo = ({
  user,
  bankAccount,
  countries,
  account,
  onChangeBankCode,
  onCreateSubmit,
  onEditSubmit,
  onDelete,
  onCompleteVerification,
  provider
}: PayoutSettingsBankAccountInfoProps) => {
  const activeProvider = provider || envPaymentProvider
  if (activeProvider === 'whop') {
    const country = account?.data?.country || user?.data?.country || countries?.data?.country || '—'
    const currency = (
      account?.data?.default_currency ||
      account?.data?.currency ||
      countries?.data?.default_currency ||
      'usd'
    ).toUpperCase()

    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          <FormattedMessage
            id="payout-settings.whop.bank.info"
            defaultMessage="Your bank account and payout method are set up on Whop during verification — Gitpay does not store bank details for Whop. Use “Complete verification on Whop” on the Account holder tab if you still need to add a payout method."
          />
        </Alert>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            <FormattedMessage
              id="payout-settings.whop.bank.title"
              defaultMessage="Payout destination (Whop)"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <FormattedMessage
              id="payout-settings.whop.bank.hint"
              defaultMessage="Currency is derived from your Gitpay country. Withdrawals debit your Whop connected company balance in this currency when a payout method is configured on Whop."
            />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Field
              name="whop_bank_country"
              label={
                <FormattedMessage
                  id="payout-settings.whop.field.country"
                  defaultMessage="Country"
                />
              }
              defaultValue={String(country).toUpperCase()}
              disabled
              completed
            />
            <Field
              name="whop_bank_currency"
              label={
                <FormattedMessage
                  id="payout-settings.whop.field.currency"
                  defaultMessage="Payout currency"
                />
              }
              defaultValue={currency}
              disabled
              completed
            />
          </Box>
          {onCompleteVerification ? (
            <Box sx={{ mt: 2 }}>
              <Typography
                component="button"
                type="button"
                onClick={onCompleteVerification}
                sx={{
                  border: 0,
                  background: 'none',
                  color: 'primary.main',
                  cursor: 'pointer',
                  p: 0,
                  textDecoration: 'underline',
                  font: 'inherit'
                }}
              >
                <FormattedMessage
                  id="payout-settings.whop.bank.openPortal"
                  defaultMessage="Open Whop to manage bank / payout method"
                />
              </Typography>
            </Box>
          ) : null}
        </Paper>
      </Box>
    )
  }

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

export default PayoutSetingsBankAccountInfo
