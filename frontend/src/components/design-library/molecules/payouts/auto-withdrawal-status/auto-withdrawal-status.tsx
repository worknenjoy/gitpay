import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import TuneIcon from '@mui/icons-material/Tune'
import StatusIndicator from 'design-library/atoms/status/status-indicator/status-indicator'

export type AutoWithdrawalFrequency = 'daily' | 'weekly' | 'monthly'

export type AutoWithdrawalStatusProps = {
  /** false -> no payout account yet; the action reads "Set up" instead of "Change" */
  connected?: boolean
  enabled: boolean
  frequency?: AutoWithdrawalFrequency | null
  /** ISO date of the next automatic withdrawal, shown as a tooltip */
  nextRunDate?: string | null
  /** Where the user changes the schedule. Omit for a read-only status. */
  onChange?: () => void
  completed?: boolean
}

const FREQUENCY_LABELS: Record<AutoWithdrawalFrequency, React.ReactNode> = {
  daily: <FormattedMessage id="autoWithdrawal.frequency.daily" defaultMessage="Daily" />,
  weekly: <FormattedMessage id="autoWithdrawal.frequency.weekly" defaultMessage="Weekly" />,
  monthly: <FormattedMessage id="autoWithdrawal.frequency.monthly" defaultMessage="Monthly" />
}

/**
 * "Automatic withdrawals · Weekly" status with an optional Change action.
 * Provider agnostic: the page decides what Change does (e.g. open the Whop payouts portal).
 */
const AutoWithdrawalStatus = ({
  connected = true,
  enabled,
  frequency,
  nextRunDate,
  onChange,
  completed = true
}: AutoWithdrawalStatusProps) => {
  const label =
    enabled && frequency ? (
      <FormattedMessage
        id="autoWithdrawal.enabled"
        defaultMessage="Automatic withdrawals · {frequency}"
        values={{ frequency: <b>{FREQUENCY_LABELS[frequency]}</b> }}
      />
    ) : enabled ? (
      <FormattedMessage
        id="autoWithdrawal.enabledNoFrequency"
        defaultMessage="Automatic withdrawals"
      />
    ) : (
      <FormattedMessage
        id="autoWithdrawal.disabled"
        defaultMessage="Automatic withdrawals disabled"
      />
    )

  const tooltip =
    enabled && nextRunDate ? (
      <FormattedMessage
        id="autoWithdrawal.nextRun"
        defaultMessage="Next run {date}"
        values={{ date: moment(nextRunDate).format('D MMM') }}
      />
    ) : undefined

  return (
    <StatusIndicator
      completed={completed}
      tone={enabled ? 'success' : 'neutral'}
      label={label}
      tooltip={tooltip}
      action={
        onChange
          ? {
              label: connected ? (
                <FormattedMessage id="autoWithdrawal.change" defaultMessage="Change" />
              ) : (
                <FormattedMessage id="autoWithdrawal.setUp" defaultMessage="Set up" />
              ),
              icon: <TuneIcon />,
              onClick: onChange
            }
          : undefined
      }
    />
  )
}

export default AutoWithdrawalStatus
