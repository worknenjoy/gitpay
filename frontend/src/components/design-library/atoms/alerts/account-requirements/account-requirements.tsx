import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { AlertTitle, Typography } from '@mui/material'
import { validAccount } from '../../../../../utils/valid-account'
import api from '../../../../../consts'
import Button from '../../../atoms/buttons/button/button'
import { CustomAlert } from './account-requirements.styles'

const isWhopProvider = (account) => {
  if (account?.data?.provider === 'whop') return true
  if (account?.data?.provider === 'stripe') return false
  const envProvider =
    (typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER) || 'stripe'
  return envProvider === 'whop'
}

const hasWhopConnectedAccount = (user, account) =>
  Boolean(account?.data?.id || user?.whop_account_id)

/**
 * Account requirements banner (design library).
 * Stripe: shows when Connect account has missing requirements / not valid.
 * Whop: can be forced on Account holder details when a connected company exists,
 * prompting the user to complete verification via Whop account_links.
 */
const AccountRequirements = ({ user, account, intl, onClick, forceShow = false }) => {
  const { completed = true } = account || {}
  const isRejected = account?.data?.requirements?.disabled_reason?.startsWith('rejected')
  const whop = isWhopProvider(account)
  const whopConnected = hasWhopConnectedAccount(user, account)

  if (isRejected) {
    return (
      <CustomAlert
        completed={completed}
        severity="error"
        action={
          <Button
            completed={completed}
            component="a"
            href="mailto:contact@gitpay.me"
            variant="contained"
            color="error"
            size="small"
            label={
              <FormattedMessage
                id="payout-settings.verification.rejected.contact"
                defaultMessage="Contact us at contact@gitpay.me"
              />
            }
          />
        }
      >
        <AlertTitle>
          <FormattedMessage
            id="payout-settings.verification.rejected.title"
            defaultMessage="Account rejected by payment provider"
          />
        </AlertTitle>
        <Typography variant="body2" gutterBottom>
          <FormattedMessage
            id="payout-settings.verification.rejected.description"
            defaultMessage="Your payment provider rejected this payout account after a risk review. Payouts are currently disabled."
          />
        </Typography>
      </CustomAlert>
    )
  }

  // Whop: prompt to complete verification on Whop when connected (holder uses forceShow)
  if (whop && whopConnected && (forceShow || !validAccount(user, account))) {
    return (
      <CustomAlert
        completed={completed}
        severity="warning"
        action={
          <Button
            completed={completed}
            onClick={onClick}
            variant="contained"
            color="secondary"
            size="small"
            label={
              <FormattedMessage
                id="payout-settings.whop.verification.button"
                defaultMessage="Complete verification on Whop"
              />
            }
          />
        }
      >
        <AlertTitle>
          <FormattedMessage id="profile.transfer.actionrequired" defaultMessage="Action required" />
        </AlertTitle>
        <Typography variant="body2" gutterBottom>
          <FormattedMessage
            id="payout-settings.whop.verification.description"
            defaultMessage="Complete verification on Whop before you can receive payouts. You will be redirected to Whop to finish identity and payout setup."
          />
        </Typography>
      </CustomAlert>
    )
  }

  const missingRequirements = () => {
    if (account?.data?.requirements?.currently_due?.length > 0) {
      return account?.data?.requirements?.currently_due.map((requirement, index) => {
        const requirementItem = api.ACCOUNT_FIELDS?.[requirement]
        return requirementItem ? (
          <li key={index}>{intl.formatMessage(requirementItem)}</li>
        ) : (
          <li key={index}>
            {intl.formatMessage({
              id: 'consts.account.requirement.other',
              defaultMessage: 'Other'
            })}
          </li>
        )
      })
    }
  }

  // Default path (Stripe, and Whop accounts that haven't connected yet at all)
  return !validAccount(user, account) ? (
    <CustomAlert
      completed={completed}
      severity="warning"
      action={
        <Button
          completed={completed}
          onClick={onClick}
          variant="outlined"
          color="secondary"
          size="small"
          label={
            <FormattedMessage id="transfers.alert.button" defaultMessage="Update your account" />
          }
        />
      }
    >
      <AlertTitle>
        <FormattedMessage id="profile.transfer.actionrequired" defaultMessage="Action required" />
      </AlertTitle>
      <Typography variant="body2" gutterBottom>
        <FormattedMessage
          id="profile.transfer.notactive"
          defaultMessage="Additional information is required before payouts can continue for this account."
        />
      </Typography>
      {missingRequirements() && (
        <>
          <Typography variant="body2" gutterBottom sx={{ mt: 0.5 }}>
            <FormattedMessage
              id="profile.transfer.missingrequirements"
              defaultMessage="Missing requirements:"
            />
          </Typography>
          <ul>{missingRequirements()}</ul>
        </>
      )}
    </CustomAlert>
  ) : null
}

export default injectIntl(AccountRequirements)
