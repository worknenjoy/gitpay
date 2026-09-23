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
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'

type OrderDetails = {
  id?: number
  status?: string
  provider?: string
  source_id?: string | null
  authorization_id?: string | null
  payment_url?: string | null
  amount?: string | number | null
  currency?: string
  createdAt?: string | Date
  paypal?: { status?: string } | null
}

type Task = {
  id?: number
  title?: string
  url?: string
  provider?: string
} | null

type IssueOrderDetailsActionProps = {
  open: boolean
  order: { data?: OrderDetails; completed?: boolean }
  task?: Task
  onClose: () => void
  onCancel: (id?: number) => void
}

const buildSections = (data: OrderDetails | undefined, task: Task): DetailsSection[] => {
  if (!data) return []

  const infoItems: DetailsItem[] = [
    {
      label: <FormattedMessage id="task.bounties.order.details.status" defaultMessage="Status" />,
      value: <PaymentStatus status={(data.status as any) || 'canceled'} />
    },
    {
      label: <FormattedMessage id="task.bounties.order.details.bounty" defaultMessage="Bounty" />,
      value: task ? <IssueLinkField issue={task} /> : MISSING
    },
    {
      label: (
        <FormattedMessage id="task.bounties.order.details.provider" defaultMessage="Provider" />
      ),
      value: data.provider || MISSING
    }
  ]

  if (data.provider === 'paypal') {
    infoItems.push(
      copyableIdItem(
        <FormattedMessage id="task.bounties.order.details.order_id" defaultMessage="Order ID" />,
        data.source_id
      ),
      copyableIdItem(
        <FormattedMessage
          id="task.bounties.order.details.authorization_id"
          defaultMessage="Authorization ID"
        />,
        data.authorization_id
      )
    )
  } else {
    infoItems.push(
      copyableIdItem(
        <FormattedMessage id="task.bounties.order.details.order_id" defaultMessage="Order ID" />,
        data.source_id
      )
    )
  }

  infoItems.push(
    {
      label: <FormattedMessage id="task.bounties.order.details.amount" defaultMessage="Amount" />,
      value: data.amount != null ? formatMoney(data.amount, data.currency) : MISSING
    },
    {
      label: <FormattedMessage id="task.bounties.order.details.created" defaultMessage="Created" />,
      value: formatDateTime(data.createdAt) || MISSING
    }
  )

  return [
    {
      title: (
        <FormattedMessage
          id="task.bounties.order.details.paymentInfo"
          defaultMessage="Payment info"
        />
      ),
      items: infoItems
    }
  ]
}

const IssueOrderDetailsAction = ({
  open,
  order,
  task = null,
  onClose,
  onCancel
}: IssueOrderDetailsActionProps) => {
  const { data, completed } = order
  const sections = useMemo(() => buildSections(data, task), [data, task])

  const canCancelPaypalAuthorization =
    Boolean(data) &&
    data?.status !== 'canceled' &&
    Boolean(data?.paypal) &&
    (data?.paypal?.status === 'APPROVED' || data?.paypal?.status === 'COMPLETED')

  const canRetry = Boolean(data?.payment_url) && data?.status !== 'succeeded'

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      completed={completed}
      mode="medium"
      title={
        <FormattedMessage id="task.bounties.order.details.title" defaultMessage="Order details" />
      }
      subtitle={
        <FormattedMessage
          id="task.bounties.order.details.message"
          defaultMessage="We have here more info about your order from your provider"
        />
      }
      sections={sections}
      actions={[
        ...(canRetry
          ? [
              {
                label: <FormattedMessage id="general.buttons.retry" defaultMessage="Retry" />,
                onClick: () => {
                  window.location.href = data!.payment_url as string
                },
                variant: 'contained',
                color: 'secondary'
              }
            ]
          : []),
        ...closeAction(onClose)
      ]}
    >
      {canCancelPaypalAuthorization && (
        <ConfirmButton
          label={
            <FormattedMessage
              id="task.bounties.order.details.action.cancel"
              defaultMessage="Cancel payment authorization"
            />
          }
          dialogMessage={
            <FormattedMessage
              id="task.bounties.details.paypal"
              defaultMessage="Are you sure you want to cancel this pre-payment?"
            />
          }
          alertMessage={
            <FormattedMessage
              id="task.bounties.cancel.paypal.caution"
              defaultMessage="If you cancel this payment, your pre-approved payment will be canceled and the balance will be canceled from this issue"
            />
          }
          onConfirm={() => onCancel(data?.id)}
          variant="contained"
          color="secondary"
        />
      )}
    </DetailsSidePanel>
  )
}

export default IssueOrderDetailsAction
