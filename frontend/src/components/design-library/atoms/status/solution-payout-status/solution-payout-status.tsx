import React from 'react'
import { useIntl } from 'react-intl'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'
import { softToneStyles } from 'design-library/atoms/status/status-chip/status-chip-tone-styles'

export type SolutionPayoutStatusValue = 'ready' | 'waiting' | 'none'

type SolutionPayoutStatusProps = {
  status: SolutionPayoutStatusValue
  completed?: boolean
}

/** Whether a sent solution can be paid: merged (ready), still open (waiting) or not eligible. */
const SolutionPayoutStatus = ({ status, completed = true }: SolutionPayoutStatusProps) => {
  const intl = useIntl()
  const statusList = [
    {
      status: 'ready',
      label: intl.formatMessage({
        id: 'solutionPayout.status.ready',
        defaultMessage: 'Ready to pay'
      }),
      color: 'success'
    },
    {
      status: 'waiting',
      label: intl.formatMessage({
        id: 'solutionPayout.status.waiting',
        defaultMessage: 'Waiting for merge'
      }),
      color: 'warning'
    },
    {
      status: 'none',
      label: intl.formatMessage({
        id: 'solutionPayout.status.none',
        defaultMessage: 'Not eligible'
      }),
      color: 'neutral'
    }
  ]

  return (
    <BaseStatus
      status={status}
      statusList={statusList}
      styles={softToneStyles()}
      completed={completed}
    />
  )
}

export default SolutionPayoutStatus
