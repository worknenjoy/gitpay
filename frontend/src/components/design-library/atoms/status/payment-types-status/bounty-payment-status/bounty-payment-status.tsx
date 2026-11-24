import React from 'react'
import { useIntl } from 'react-intl'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'
import { softToneStyles } from 'design-library/atoms/status/status-chip/status-chip-tone-styles'

export type BountyPaymentStatusValue = 'paid' | 'pledged' | 'pending'

type BountyPaymentStatusProps = {
  status: BountyPaymentStatusValue
  completed?: boolean
}

/** One payment that makes up a bounty: held by Gitpay, pledged for later, or an open invoice. */
const BountyPaymentStatus = ({ status, completed = true }: BountyPaymentStatusProps) => {
  const intl = useIntl()
  const statusList = [
    {
      status: 'paid',
      label: intl.formatMessage({ id: 'bountyPayment.status.paid', defaultMessage: 'Paid · held' }),
      color: 'success'
    },
    {
      status: 'pledged',
      label: intl.formatMessage({
        id: 'bountyPayment.status.pledged',
        defaultMessage: 'Pay later'
      }),
      color: 'warning'
    },
    {
      status: 'pending',
      label: intl.formatMessage({
        id: 'bountyPayment.status.pending',
        defaultMessage: 'Invoice pending'
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

export default BountyPaymentStatus
