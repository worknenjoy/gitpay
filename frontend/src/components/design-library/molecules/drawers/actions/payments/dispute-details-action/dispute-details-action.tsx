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
import { convertStripeAmountByCurrency } from 'design-library/molecules/cards/balance-card/balance-card'

/** A row of the seller's payment-request balance ledger — covers disputes, refunds, extra fees
 * and manual adjustments (see `PaymentRequestBalanceTransaction.reason`), not only disputes;
 * this panel backs the "Disputes and refunds fees" tab, whichever reason a row has. */
type BalanceTransaction = {
  id?: number
  reason?: 'DISPUTE' | 'REFUND' | 'EXTRA_FEE' | 'ADJUSTMENT' | string
  reason_details?: string | null
  type?: 'CREDIT' | 'DEBIT' | string
  status?: string
  amount?: string | number | null
  currency?: string
  sourceId?: string | null
  openedAt?: string | Date | null
  closedAt?: string | Date | null
  createdAt?: string | Date
}

type DisputeDetailsActionProps = {
  open: boolean
  onClose: () => void
  transaction: BalanceTransaction | null
  completed?: boolean
}

const buildSections = (transaction: BalanceTransaction | null): DetailsSection[] => {
  if (!transaction) return []

  const amount =
    transaction.amount != null
      ? convertStripeAmountByCurrency(transaction.amount, transaction.currency)
      : null

  const infoItems: DetailsItem[] = [
    {
      label: <FormattedMessage id="disputes.details.reason" defaultMessage="Reason" />,
      value: transaction.reason || MISSING
    },
    {
      label: <FormattedMessage id="disputes.details.type" defaultMessage="Type" />,
      value: transaction.type || MISSING
    },
    {
      label: <FormattedMessage id="disputes.details.status" defaultMessage="Status" />,
      value: transaction.status || MISSING
    },
    {
      label: <FormattedMessage id="disputes.details.amount" defaultMessage="Amount" />,
      value: amount ? formatMoney(amount, transaction.currency) : MISSING
    },
    {
      label: (
        <FormattedMessage id="disputes.details.reasonDetails" defaultMessage="Reason details" />
      ),
      value: transaction.reason_details || MISSING
    },
    copyableIdItem(
      <FormattedMessage id="disputes.details.sourceId" defaultMessage="Source ID" />,
      transaction.sourceId
    ),
    {
      label: <FormattedMessage id="disputes.details.openedAt" defaultMessage="Opened" />,
      value: formatDateTime(transaction.openedAt) || MISSING
    },
    {
      label: <FormattedMessage id="disputes.details.closedAt" defaultMessage="Closed" />,
      value: formatDateTime(transaction.closedAt) || MISSING
    },
    {
      label: <FormattedMessage id="disputes.details.created" defaultMessage="Created" />,
      value: formatDateTime(transaction.createdAt) || MISSING
    }
  ]

  return [
    {
      title: (
        <FormattedMessage id="disputes.details.transactionInfo" defaultMessage="Transaction info" />
      ),
      items: infoItems
    }
  ]
}

const DisputeDetailsAction = ({
  open,
  onClose,
  transaction,
  completed = true
}: DisputeDetailsActionProps) => {
  const sections = useMemo(() => buildSections(transaction), [transaction])

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      completed={completed}
      mode="medium"
      title={<FormattedMessage id="disputes.details.title" defaultMessage="Transaction details" />}
      subtitle={
        <FormattedMessage
          id="disputes.details.subtitle"
          defaultMessage="Breakdown and status for this dispute or refund fee"
        />
      }
      sections={sections}
      actions={closeAction(onClose)}
    />
  )
}

export default DisputeDetailsAction
