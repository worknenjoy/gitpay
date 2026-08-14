import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import DetailList from '../../data-display/detail-list/detail-list'
import DetailRow from '../../../atoms/data-display/detail-row/detail-row'
import BalanceCard from '../../cards/balance-card/balance-card'

export type WhopScheduleBalancesPanelProps = {
  account?: any
  onManageOnWhop?: () => void
}

/**
 * "Payout schedule & balances" panel. Whop pays out on demand (no fixed schedule),
 * and balances come from the connected company ledger.
 */
const WhopScheduleBalancesPanel = ({ account, onManageOnWhop }: WhopScheduleBalancesPanelProps) => {
  const { data = {}, completed = true } = account || {}
  const balances = data.balances || { available: 0, pending: 0, reserve: 0 }
  const currency = (data.currency || data.default_currency || 'usd').toUpperCase()

  return (
    <Box>
      <DetailList
        completed={completed}
        title={
          <FormattedMessage
            id="payout-settings.whop.schedule.title"
            defaultMessage="Payout schedule"
          />
        }
        subtitle={
          <FormattedMessage
            id="payout-settings.whop.schedule.subtitle"
            defaultMessage="When and how your available balance is sent to your payout method."
          />
        }
        action={
          onManageOnWhop
            ? {
                label: (
                  <FormattedMessage
                    id="payout-settings.whop.schedule.manage"
                    defaultMessage="Manage on Whop"
                  />
                ),
                onClick: onManageOnWhop
              }
            : undefined
        }
      >
        <DetailRow
          completed={completed}
          label={
            <FormattedMessage id="payout-settings.whop.schedule.method" defaultMessage="Schedule" />
          }
          value={
            <FormattedMessage
              id="payout-settings.whop.schedule.onDemand"
              defaultMessage="On demand (request a withdrawal on Whop)"
            />
          }
        />
        <DetailRow
          completed={completed}
          label={
            <FormattedMessage
              id="payout-settings.whop.schedule.currency"
              defaultMessage="Payout currency"
            />
          }
          value={currency}
        />
      </DetailList>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>
        <FormattedMessage
          id="payout-settings.whop.balances.title"
          defaultMessage="Company balances (Whop)"
        />
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <BalanceCard
            completed={completed}
            name={
              <FormattedMessage
                id="payout-settings.whop.balances.available"
                defaultMessage="Available"
              />
            }
            balance={Number(balances.available || 0)}
            currency={currency}
            type="decimal"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <BalanceCard
            completed={completed}
            name={
              <FormattedMessage
                id="payout-settings.whop.balances.pending"
                defaultMessage="Pending"
              />
            }
            balance={Number(balances.pending || 0)}
            currency={currency}
            type="decimal"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <BalanceCard
            completed={completed}
            name={
              <FormattedMessage
                id="payout-settings.whop.balances.reserve"
                defaultMessage="Reserve"
              />
            }
            balance={Number(balances.reserve || 0)}
            currency={currency}
            type="decimal"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default WhopScheduleBalancesPanel
