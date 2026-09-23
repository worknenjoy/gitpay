import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import DetailsSidePanel, {
  DetailsItem,
  DetailsSection
} from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import {
  MISSING,
  formatDateTime,
  formatMoney,
  copyableIdItem,
  closeAction
} from 'design-library/molecules/drawers/details-side-panel/details-panel-helpers'
import PayoutStatus from 'design-library/atoms/status/payout-status/payout-status'
import { convertStripeAmountByCurrency } from 'design-library/molecules/cards/balance-card/balance-card'

type Payout = {
  id?: number
  source_id?: string | null
  method?: string | null
  amount?: string | number | null
  currency?: string
  status?: string
  paid?: boolean
  arrival_date?: string | number | null
  reference_number?: string | null
  notified_status?: string | null
  createdAt?: string | Date
}

type PayoutDetailsActionProps = {
  open: boolean
  onClose: () => void
  payout: Payout | null
  completed?: boolean
}

const buildSections = (payout: Payout | null): DetailsSection[] => {
  if (!payout) return []

  const amount = convertStripeAmountByCurrency(payout.amount, payout.currency)

  const infoItems: DetailsItem[] = [
    {
      label: <FormattedMessage id="payouts.details.status" defaultMessage="Status" />,
      value: payout.status ? <PayoutStatus status={payout.status} /> : MISSING
    },
    {
      label: <FormattedMessage id="payouts.details.method" defaultMessage="Transfer method" />,
      value: payout.method || MISSING
    },
    {
      label: <FormattedMessage id="payouts.details.amount" defaultMessage="Amount" />,
      value: amount ? formatMoney(amount, payout.currency) : MISSING
    },
    copyableIdItem(
      <FormattedMessage id="payouts.details.payoutId" defaultMessage="Payout ID" />,
      payout.source_id
    ),
    {
      label: (
        <FormattedMessage id="payouts.details.referenceNumber" defaultMessage="Reference number" />
      ),
      value: payout.reference_number || MISSING
    },
    {
      label: <FormattedMessage id="payouts.details.arrivalDate" defaultMessage="Arrival date" />,
      value: payout.arrival_date
        ? formatDateTime(new Date(Number(payout.arrival_date) * 1000))
        : MISSING
    },
    {
      label: <FormattedMessage id="payouts.details.created" defaultMessage="Created" />,
      value: formatDateTime(payout.createdAt) || MISSING
    }
  ]

  return [
    {
      title: <FormattedMessage id="payouts.details.payoutInfo" defaultMessage="Payout info" />,
      items: infoItems
    }
  ]
}

const PayoutDetailsAction = ({
  open,
  onClose,
  payout,
  completed = true
}: PayoutDetailsActionProps) => {
  const sections = useMemo(() => buildSections(payout), [payout])

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      completed={completed}
      mode="medium"
      title={<FormattedMessage id="payouts.details.title" defaultMessage="Payout details" />}
      subtitle={
        <FormattedMessage
          id="payouts.details.subtitle"
          defaultMessage="Breakdown and status for this payout"
        />
      }
      sections={sections}
      actions={closeAction(onClose)}
    />
  )
}

export default PayoutDetailsAction
