import React from 'react'
import { Box, Typography } from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { FormattedMessage } from 'react-intl'
import DetailList from '../../data-display/detail-list/detail-list'
import DetailRow from '../../../atoms/data-display/detail-row/detail-row'
import Button from '../../../atoms/buttons/button/button'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

export type WhopPayoutMethodPanelProps = {
  account?: any
  onManageOnWhop?: () => void
}

/**
 * "Payout method" read-only panel. Bank/card/crypto is added on the Whop portal, so
 * this lists whatever Whop reports or an empty "managed on Whop" state.
 */
const WhopPayoutMethodPanel = ({ account, onManageOnWhop }: WhopPayoutMethodPanelProps) => {
  const { data = {}, completed = true } = account || {}
  const methods: any[] = data.payout_methods || (data.payout_method ? [data.payout_method] : [])

  if (completed && methods.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
        <AccountBalanceIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          <FormattedMessage
            id="payout-settings.whop.payoutMethod.empty.title"
            defaultMessage="No payout method yet"
          />
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 480, mx: 'auto' }}
        >
          <FormattedMessage
            id="payout-settings.whop.payoutMethod.empty.description"
            defaultMessage="Add a bank account, debit card or USDC wallet on Whop. Gitpay sends your payouts to whichever method you set as default there."
          />
        </Typography>
        {onManageOnWhop ? (
          <Button
            variant="contained"
            color="secondary"
            endIcon={<OpenInNewIcon />}
            onClick={onManageOnWhop}
            label={
              <FormattedMessage
                id="payout-settings.whop.payoutMethod.add"
                defaultMessage="Add payout method on Whop"
              />
            }
          />
        ) : null}
      </Box>
    )
  }

  return (
    <DetailList
      completed={completed}
      title={
        <FormattedMessage
          id="payout-settings.whop.payoutMethod.title"
          defaultMessage="Payout method"
        />
      }
      subtitle={
        <FormattedMessage
          id="payout-settings.whop.payoutMethod.subtitle"
          defaultMessage="Where Whop sends the money Gitpay releases to you."
        />
      }
      action={
        onManageOnWhop
          ? {
              label: (
                <FormattedMessage
                  id="payout-settings.whop.payoutMethod.manage"
                  defaultMessage="Manage on Whop"
                />
              ),
              onClick: onManageOnWhop
            }
          : undefined
      }
      footnote={
        <FormattedMessage id="payout-settings.whop.managed" defaultMessage="Managed on Whop" />
      }
    >
      {methods.map((method, index) => (
        <DetailRow
          key={method.id || index}
          completed={completed}
          label={method.type || 'Payout method'}
          value={method.label || method.id}
          hint={method.last4 ? `•••• ${method.last4}` : undefined}
          status={method.default ? 'DEFAULT' : undefined}
          statusColor="success"
        />
      ))}
    </DetailList>
  )
}

export default WhopPayoutMethodPanel
