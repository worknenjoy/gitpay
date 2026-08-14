import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import DetailsSidePanel, {
  DetailsItem,
  DetailsSection
} from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'

type PaymentRequestPayment = {
  id?: number
  source?: string
  amount?: string | number
  amount_after_fees?: string | number | null
  currency?: string
  status?: string
  createdAt?: string | Date
  updatedAt?: string | Date
  PaymentRequest?: {
    title?: string
    provider?: string
  } | null
  PaymentRequestCustomer?: {
    email?: string
  } | null
}

type PaymentRequestPaymentDetailsActionProps = {
  open: boolean
  onClose: () => void
  payment: PaymentRequestPayment | null
  completed?: boolean
}

const MISSING = <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />

const formatMoney = (value: number, currencySymbol = '$') => {
  const abs = Math.abs(value)
  const formatted = abs.toFixed(2)
  return value < 0 ? `-${currencySymbol}${formatted}` : `${currencySymbol}${formatted}`
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return null
  return moment(value).format('MMM D, h:mm A')
}

const parseAmount = (value?: string | number | null): number | null => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const buildActivityItems = (payment: PaymentRequestPayment): DetailsItem[] => {
  const created = formatDateTime(payment.createdAt)
  const updated = formatDateTime(payment.updatedAt)
  const status = (payment.status || '').toLowerCase()

  if (status === 'refunded') {
    return [
      {
        label: (
          <FormattedMessage
            id="paymentRequest.payment.details.activity.refunded"
            defaultMessage="Payment refunded"
          />
        ),
        value: updated || created || '—'
      },
      {
        label: (
          <FormattedMessage
            id="paymentRequest.payment.details.activity.completed"
            defaultMessage="Payment completed"
          />
        ),
        value: created || '—'
      }
    ]
  }

  if (status === 'paid' || status === 'succeeded') {
    return [
      {
        label: (
          <FormattedMessage
            id="paymentRequest.payment.details.activity.completed"
            defaultMessage="Payment completed"
          />
        ),
        value: created || '—'
      }
    ]
  }

  if (status === 'failed') {
    return [
      {
        label: (
          <FormattedMessage
            id="paymentRequest.payment.details.activity.failed"
            defaultMessage="Payment failed"
          />
        ),
        value: updated || created || '—'
      }
    ]
  }

  return [
    {
      label: (
        <FormattedMessage
          id="paymentRequest.payment.details.activity.status"
          defaultMessage="Payment {status}"
          values={{ status: payment.status || 'unknown' }}
        />
      ),
      value: created || '—'
    }
  ]
}

const buildSections = (payment: PaymentRequestPayment | null): DetailsSection[] => {
  if (!payment) return []

  const gross = parseAmount(payment.amount)
  const net = parseAmount(payment.amount_after_fees)
  const fees = gross != null && net != null ? gross - net : null
  const currencySymbol = '$'

  const breakdownItems: DetailsItem[] = []

  if (gross != null) {
    breakdownItems.push({
      label: (
        <FormattedMessage
          id="paymentRequest.payment.details.customerPaid"
          defaultMessage="Customer paid"
        />
      ),
      value: formatMoney(gross, currencySymbol)
    })
  }

  if (fees != null && fees > 0) {
    breakdownItems.push({
      label: <FormattedMessage id="paymentRequest.payment.details.fees" defaultMessage="Fees" />,
      value: formatMoney(-fees, currencySymbol),
      variant: 'negative'
    })
  }

  if (net != null) {
    breakdownItems.push({
      label: (
        <FormattedMessage
          id="paymentRequest.payment.details.netAmount"
          defaultMessage="Net amount"
        />
      ),
      value: formatMoney(net, currencySymbol),
      variant: 'emphasis'
    })
  }

  const infoItems: DetailsItem[] = [
    {
      label: (
        <FormattedMessage id="paymentRequest.payment.details.status" defaultMessage="Status" />
      ),
      value: payment.status ? <PaymentStatus status={payment.status as any} /> : MISSING
    },
    {
      label: (
        <FormattedMessage
          id="paymentRequest.payment.details.paymentRequest"
          defaultMessage="Payment request"
        />
      ),
      value: payment.PaymentRequest?.title || MISSING
    },
    {
      label: (
        <FormattedMessage id="paymentRequest.payment.details.customer" defaultMessage="Customer" />
      ),
      value: payment.PaymentRequestCustomer?.email || MISSING
    },
    {
      label: (
        <FormattedMessage id="paymentRequest.payment.details.provider" defaultMessage="Provider" />
      ),
      value: payment.PaymentRequest?.provider || MISSING
    },
    {
      label: (
        <FormattedMessage
          id="paymentRequest.payment.details.paymentId"
          defaultMessage="Payment ID"
        />
      ),
      value: payment.source || MISSING
    },
    {
      label: (
        <FormattedMessage id="paymentRequest.payment.details.created" defaultMessage="Created" />
      ),
      value: formatDateTime(payment.createdAt) || MISSING
    }
  ]

  const sections: DetailsSection[] = []

  if (breakdownItems.length > 0) {
    sections.push({
      title: (
        <FormattedMessage
          id="paymentRequest.payment.details.breakdown"
          defaultMessage="Breakdown"
        />
      ),
      items: breakdownItems
    })
  }

  sections.push({
    title: (
      <FormattedMessage
        id="paymentRequest.payment.details.paymentInfo"
        defaultMessage="Payment info"
      />
    ),
    items: infoItems
  })

  sections.push({
    title: (
      <FormattedMessage id="paymentRequest.payment.details.activity" defaultMessage="Activity" />
    ),
    items: buildActivityItems(payment)
  })

  return sections
}

const PaymentRequestPaymentDetailsAction = ({
  open,
  onClose,
  payment,
  completed = true
}: PaymentRequestPaymentDetailsActionProps) => {
  const sections = useMemo(() => buildSections(payment), [payment])

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      completed={completed}
      title={
        <FormattedMessage
          id="paymentRequest.payment.details.title"
          defaultMessage="Payment details"
        />
      }
      subtitle={
        <FormattedMessage
          id="paymentRequest.payment.details.subtitle"
          defaultMessage="Breakdown and status for this payment"
        />
      }
      sections={sections}
      actions={[
        {
          label: <FormattedMessage id="general.buttons.close" defaultMessage="Close" />,
          onClick: onClose,
          variant: 'contained',
          color: 'secondary'
        }
      ]}
    />
  )
}

export default PaymentRequestPaymentDetailsAction
