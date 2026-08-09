import React from 'react'
import { FormattedMessage } from 'react-intl'
import { AlertTitle, Box, Divider, Typography } from '@mui/material'
import SecondaryTitle from '../../../../atoms/typography/secondary-title/secondary-title'
import { CustomAlert } from '../../../../atoms/alerts/alert/alert'

const paymentProvider =
  (typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER) || 'stripe'

const PayoutSettingsBankAccountVerificationReturn = ({ completed = true }) => {
  const isWhop = paymentProvider === 'whop'

  return (
    <Box>
      <SecondaryTitle
        title={
          <FormattedMessage
            id="payout-settings.verification.title"
            defaultMessage="Additional requirements"
          />
        }
        subtitle={
          <FormattedMessage
            id="payout-settings.verification.subtitle"
            defaultMessage="Keep your account ready to receive payouts."
          />
        }
      />
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        <FormattedMessage id="payout-settings.verification.status" defaultMessage="Status" />
      </Typography>

      <CustomAlert severity="success" completed={completed}>
        <AlertTitle>
          <FormattedMessage
            id="payout-settings.verification.return.title"
            defaultMessage="Account verification submitted"
          />
        </AlertTitle>
        <Typography variant="body2">
          {isWhop ? (
            <FormattedMessage
              id="payout-settings.verification.return.description.whop"
              defaultMessage="Thanks — your Whop payout account details were submitted successfully. Your account is ready to receive transfers once Whop finishes any remaining checks."
            />
          ) : (
            <FormattedMessage
              id="payout-settings.verification.return.description"
              defaultMessage="Thanks — Stripe got your details and is reviewing them now. Most accounts are approved within a few minutes; some can take up to 1–2 business days."
            />
          )}
        </Typography>
      </CustomAlert>
    </Box>
  )
}

export default PayoutSettingsBankAccountVerificationReturn
