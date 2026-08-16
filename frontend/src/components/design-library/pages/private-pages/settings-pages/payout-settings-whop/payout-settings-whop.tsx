import React from 'react'
import { Box, Typography } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { FormattedMessage } from 'react-intl'
import ProfileSecondaryHeader from '../../../../molecules/headers/profile-secondary-header/profile-secondary-header'
import PayoutAccountStatus from '../../../../atoms/status/payout-account-status/payout-account-status'
import WhopAccountTabs from '../../../../molecules/tabs/whop-account-tabs/whop-account-tabs'
import { CustomAlert } from '../../../../atoms/alerts/alert/alert'
import Button from '../../../../atoms/buttons/button/button'
import ConfirmButton from '../../../../atoms/buttons/confirm-button/confirm-button'
import { getWhopAccountStatus } from './getWhopAccountStatus'

const WHOP_DOCS_URL = 'https://docs.whop.com'

export type PayoutSettingsWhopProps = {
  account?: any
  onManageOnWhop?: () => void
  onDisconnect?: () => void
  children: React.ReactNode
}

/**
 * Whop payout tab: status header, connected/pending/rejected banner (matches
 * getWhopAccountStatus exactly, so it never claims success for a pending account),
 * vertical sub-nav with the routed panel, and disconnect + docs footer.
 *
 * The Requirements checklist banner was removed (temporarily — see
 * getWhopAccountStatus.ts) because it was derived from `company.verified`, which Whop's
 * docs confirm is a trust & safety review flag, not KYC/identity-verification completion —
 * so it could show "required" for accounts that were genuinely already verified.
 */
const PayoutSettingsWhop = ({
  account,
  onManageOnWhop,
  onDisconnect,
  children
}: PayoutSettingsWhopProps) => {
  const { completed = true } = account || {}
  const { status } = getWhopAccountStatus(account)

  const buttonStyles = { style: { marginTop: 16 } }

  return (
    <Box>
      <ProfileSecondaryHeader
        title={
          <FormattedMessage id="payout-settings.whop.title" defaultMessage="Whop payout account" />
        }
        subtitle={
          <FormattedMessage
            id="payout-settings.whop.subtitle"
            defaultMessage="Identity, payout method and schedule are set on Whop. Gitpay shows what you configured there and sends your payments to that account."
          />
        }
        aside={<PayoutAccountStatus status={status as any} completed={completed} />}
      />
      <div style={{ marginTop: 16 }} />
      {status === 'rejected' ? (
        <CustomAlert
          completed={completed}
          severity="error"
          action={
            <Button
              {...buttonStyles}
              style={{ marginTop: 8 }}
              completed={completed}
              onClick={onManageOnWhop}
              variant="outlined"
              color="secondary"
              label={
                <FormattedMessage
                  id="payout-settings.whop.banner.rejected.button"
                  defaultMessage="Resolve on Whop"
                />
              }
            />
          }
        >
          <Typography variant="subtitle2">
            <FormattedMessage
              id="payout-settings.whop.banner.rejected.title"
              defaultMessage="Action needed on Whop"
            />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="payout-settings.whop.banner.rejected.description"
              defaultMessage="Whop flagged an issue with this account. Open Whop to resolve it before payouts can continue."
            />
          </Typography>
        </CustomAlert>
      ) : status === 'active' ? (
        <CustomAlert
          completed={completed}
          severity="success"
          action={
            <Button
              {...buttonStyles}
              completed={completed}
              onClick={onManageOnWhop}
              variant="outlined"
              color="success"
              size="small"
              endIcon={<OpenInNewIcon />}
              label={
                <FormattedMessage
                  id="payout-settings.whop.manage.button"
                  defaultMessage="Manage on Whop"
                />
              }
            />
          }
        >
          <Typography variant="subtitle2">
            <FormattedMessage
              id="payout-settings.whop.banner.connected.title"
              defaultMessage="Connected to Whop"
            />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="payout-settings.whop.banner.connected.description"
              defaultMessage="Everything Whop needs is in place. Open Whop any time to change your payout method, schedule or identity details."
            />
          </Typography>
        </CustomAlert>
      ) : (
        <CustomAlert
          completed={completed}
          severity="warning"
          action={
            <Button
              {...buttonStyles}
              completed={completed}
              onClick={onManageOnWhop}
              variant="outlined"
              color="secondary"
              size="small"
              endIcon={<OpenInNewIcon />}
              label={
                <FormattedMessage
                  id="payout-settings.whop.banner.pending.button"
                  defaultMessage="Check status on Whop"
                />
              }
            />
          }
        >
          <Typography variant="subtitle2">
            <FormattedMessage
              id="payout-settings.whop.banner.pending.title"
              defaultMessage="Not yet enabled for payouts"
            />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="payout-settings.whop.banner.pending.description"
              defaultMessage="Whop hasn't marked this account active for payouts yet. Open Whop to check what's still needed, or wait for Whop to finish reviewing it."
            />
          </Typography>
        </CustomAlert>
      )}

      <Box sx={{ mt: 2 }}>
        <WhopAccountTabs>{children}</WhopAccountTabs>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mt: 3
        }}
      >
        <ConfirmButton
          variant="outlined"
          color="error"
          completed={completed}
          label={
            <FormattedMessage
              id="payout-settings.whop.disconnect"
              defaultMessage="Disconnect Whop account"
            />
          }
          dialogMessage={
            <FormattedMessage
              id="payout-settings.whop.close.confirm"
              defaultMessage="Are you sure you want to disconnect your Whop payout account from Gitpay? You can reconnect later by choosing a country again."
            />
          }
          confirmLabel={
            <FormattedMessage
              id="payout-settings.whop.disconnect"
              defaultMessage="Disconnect Whop account"
            />
          }
          cancelLabel={<FormattedMessage id="account.actions.cancel" defaultMessage="Cancel" />}
          alertMessage={
            <FormattedMessage
              id="payout-settings.whop.close.alert"
              defaultMessage="This removes the linked Whop company from Gitpay. Bank and KYC data on Whop are not deleted."
            />
          }
          alertSeverity="warning"
          onConfirm={onDisconnect}
        />
        <Typography
          variant="body2"
          component="a"
          href={WHOP_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'secondary.main',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <FormattedMessage
            id="payout-settings.whop.docs"
            defaultMessage="Whop payout documentation"
          />
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </Typography>
      </Box>
    </Box>
  )
}

export default PayoutSettingsWhop
