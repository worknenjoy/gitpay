import React from 'react'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import DetailList from '../../data-display/detail-list/detail-list'
import DetailRow from '../../../atoms/data-display/detail-row/detail-row'

export type WhopScheduleBalancesPanelProps = {
  account?: any
  onManageOnWhop?: () => void
}

const normalizeWhopSchedule = (data: any) => {
  const raw = data?.payout_schedule || data?.schedule || data?.settings?.payouts?.schedule || {}
  const interval = raw.interval || raw.frequency || raw.type || raw.value || raw.schedule || null
  const mode = raw.mode || raw.method || raw.type || null

  if (interval === 'daily' || interval === 'weekly' || interval === 'monthly') {
    return `Automatic · ${interval}`
  }

  if (interval === 'manual' || mode === 'manual') {
    return 'Manual'
  }

  if (mode === 'automatic') {
    return 'Automatic'
  }

  return 'Managed on Whop'
}

const getWhopPayoutMethod = (data: any) => {
  const methods: any[] = data?.payout_methods || (data?.payout_method ? [data.payout_method] : [])
  return methods.find((method) => method?.default) || methods[0] || null
}

/**
 * "Payout schedule" panel. Whop manages the actual payout method and payout timing,
 * so Gitpay shows a read-only summary and redirects the user to the Whop portal if they
 * need to change those settings.
 */
const WhopScheduleBalancesPanel = ({ account, onManageOnWhop }: WhopScheduleBalancesPanelProps) => {
  const { data = {}, completed = true } = account || {}
  const method = getWhopPayoutMethod(data)
  const schedule = normalizeWhopSchedule(data)
  const currency = (data.currency || data.default_currency || 'usd').toUpperCase()
  const methodLabel = method?.label || method?.type || 'Whop payout method'
  const methodMeta = [method?.last4 ? `•••• ${method.last4}` : null, method?.currency || null]
    .filter(Boolean)
    .join(' · ')

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
            defaultMessage="When and how Whop sends your available balance to your payout destination."
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
            <FormattedMessage
              id="payout-settings.whop.method.label"
              defaultMessage="Payout method"
            />
          }
          value={method ? `${methodLabel}${methodMeta ? ` · ${methodMeta}` : ''}` : 'Not set yet'}
          status={method?.default ? 'DEFAULT' : undefined}
          statusColor="success"
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
        <DetailRow
          completed={completed}
          label={
            <FormattedMessage id="payout-settings.whop.schedule.method" defaultMessage="Schedule" />
          }
          value={schedule}
        />
      </DetailList>
    </Box>
  )
}

export default WhopScheduleBalancesPanel
