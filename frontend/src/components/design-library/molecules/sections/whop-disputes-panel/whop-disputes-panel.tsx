import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import { FormattedMessage } from 'react-intl'
import DetailRow from '../../../atoms/data-display/detail-row/detail-row'

export type WhopDisputesPanelProps = {
  account?: any
}

/**
 * "Disputes / refunds" panel. Disputes arrive via Whop webhooks; when none are
 * surfaced this renders an empty state rather than fabricated rows.
 */
const WhopDisputesPanel = ({ account }: WhopDisputesPanelProps) => {
  const { data = {}, completed = true } = account || {}
  const disputes: any[] = data.disputes || []

  if (completed && disputes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
        <GavelIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          <FormattedMessage
            id="payout-settings.whop.disputes.empty.title"
            defaultMessage="No disputes or refunds"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
          <FormattedMessage
            id="payout-settings.whop.disputes.empty.description"
            defaultMessage="Chargebacks and refunds handled by Whop will appear here. Gitpay updates this automatically when Whop notifies us."
          />
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        <FormattedMessage
          id="payout-settings.whop.disputes.title"
          defaultMessage="Disputes / refunds"
        />
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, px: 2 }}>
        {disputes.map((dispute, index) => (
          <DetailRow
            key={dispute.id || index}
            completed={completed}
            label={dispute.reason || dispute.status || 'Dispute'}
            value={
              dispute.amount != null
                ? `${(dispute.currency || 'usd').toUpperCase()} ${dispute.amount}`
                : undefined
            }
            hint={dispute.created_at}
            status={dispute.status}
            statusColor="warning"
          />
        ))}
      </Paper>
    </Box>
  )
}

export default WhopDisputesPanel
