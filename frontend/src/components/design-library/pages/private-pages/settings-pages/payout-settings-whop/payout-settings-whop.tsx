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

const WHOP_DOCS_URL = 'https://docs.whop.com'

export type PayoutSettingsWhopProps = {
  account?: any
  onCompleteVerification?: () => void
  onManageOnWhop?: () => void
  onDisconnect?: () => void
  children: React.ReactNode
}

/**
 * Whop payout tab: status header, connected/verification banner, vertical sub-nav
 * with the routed panel, and disconnect + docs footer.
 */
const PayoutSettingsWhop = ({
  account,
  onCompleteVerification,
  onManageOnWhop,
  onDisconnect,
  children
}: PayoutSettingsWhopProps) => {
  const { data = {}, completed = true } = account || {}
  const checklist: Array<{ status: string }> = data?.requirements?.checklist || []
  const hasDue = checklist.some((item) => item.status === 'required')
  const rejected = data?.requirements?.disabled_reason?.startsWith?.('rejected')
  const status = rejected
    ? 'rejected'
    : hasDue
      ? 'verification_required'
      : data?.active
        ? 'active'
        : 'pending'

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

      {hasDue ? (
        <CustomAlert
          completed={completed}
          severity="warning"
          action={
            <Button
              completed={completed}
              onClick={onCompleteVerification}
              variant="contained"
              color="secondary"
              label={
                <FormattedMessage
                  id="payout-settings.whop.verification.button"
                  defaultMessage="Complete verification on Whop"
                />
              }
            />
          }
        >
          <Typography variant="subtitle2">
            <FormattedMessage
              id="payout-settings.whop.banner.verify.title"
              defaultMessage="Complete your verification on Whop"
            />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="payout-settings.whop.banner.verify.description"
              defaultMessage="Whop still needs your identity document and a payout method before Gitpay can release money to you. Nothing is lost — you can leave and come back."
            />
          </Typography>
        </CustomAlert>
      ) : (
        <CustomAlert
          completed={completed}
          severity="success"
          action={
            <Button
              completed={completed}
              onClick={onManageOnWhop}
              variant="outlined"
              color="secondary"
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
      )}

      <Box sx={{ mt: 2 }}>
        <WhopAccountTabs requirementsDue={hasDue}>{children}</WhopAccountTabs>
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
