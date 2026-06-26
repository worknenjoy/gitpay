import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, AlertTitle, Link, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

interface TransferEligibilityInfoProps {
  user?: {
    account_id?: string | null
    paypal_id?: string | null
  } | null
}

const TransferEligibilityInfo = ({ user }: TransferEligibilityInfoProps) => {
  const history = useHistory()
  const hasStripeAccount = !!user?.account_id
  const hasPaypalAccount = !!user?.paypal_id

  if (hasStripeAccount && hasPaypalAccount) return null

  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      <AlertTitle>
        <FormattedMessage id="transfer.eligibility.title" defaultMessage="Payout account info" />
      </AlertTitle>
      {!hasStripeAccount && (
        <Typography variant="body2" gutterBottom>
          <FormattedMessage
            id="transfer.eligibility.stripe"
            defaultMessage="Card payments require a payout account from a {countriesLink}. Set it up in {settingsLink}."
            values={{
              countriesLink: (
                <Link component="button" variant="body2" onClick={() => history.push('/countries')}>
                  <FormattedMessage
                    id="transfer.eligibility.stripe.countries"
                    defaultMessage="supported country"
                  />
                </Link>
              ),
              settingsLink: (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => history.push('/profile/payout-settings')}
                >
                  <FormattedMessage
                    id="transfer.eligibility.stripe.settings"
                    defaultMessage="payout settings"
                  />
                </Link>
              )
            }}
          />
        </Typography>
      )}
      {!hasPaypalAccount && (
        <Typography variant="body2">
          <FormattedMessage
            id="transfer.eligibility.paypal"
            defaultMessage="PayPal payments require a linked PayPal account — add it in {settingsLink}."
            values={{
              settingsLink: (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => history.push('/profile/payout-settings')}
                >
                  <FormattedMessage
                    id="transfer.eligibility.paypal.settings"
                    defaultMessage="payout settings"
                  />
                </Link>
              )
            }}
          />
        </Typography>
      )}
    </Alert>
  )
}

export default TransferEligibilityInfo
