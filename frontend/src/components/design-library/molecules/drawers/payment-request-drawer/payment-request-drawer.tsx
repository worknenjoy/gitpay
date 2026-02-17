import React, { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import Drawer from '../drawer/drawer'
import PaymentRequestForm from '../../../organisms/forms/payment-request-forms/payment-request-form/payment-request-form'

type PaymentRquestFormData = {
  id?: number
  active?: boolean
  deactivate_after_payment?: boolean
  amount?: number
  custom_amount?: boolean
  currency?: string
  title?: string
  description?: string
}

interface PaymentRequestDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess?: (e: any, data: any) => void
  completed?: boolean
  paymentRequest?: {
    completed: boolean
    data: PaymentRquestFormData
  }
}

const PaymentRequestDrawer: React.FC<PaymentRequestDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  completed = true,
  paymentRequest
}) => {
  const { completed: paymentRequestCompleted, data } = paymentRequest || {}
  const formRef = useRef<{ submit: () => void }>(null)

  const isEditMode = data?.id

  return (
    <Drawer
      completed={completed}
      open={open}
      onClose={onClose}
      title={
        isEditMode ? (
          <FormattedMessage id="paymentRequest.title.edit" defaultMessage="Edit Payment Request" />
        ) : (
          <FormattedMessage id="paymentRequest.title.new" defaultMessage="New Payment Request" />
        )
      }
      subtitle={
        <FormattedMessage
          id="paymentRequest.subtitle"
          defaultMessage="Please fill out the form to request payment"
        />
      }
      actions={[
        {
          label: <FormattedMessage id="actions.cancel" defaultMessage="Cancel" />,
          onClick: onClose,
          variant: 'text'
        },
        {
          label: isEditMode ? (
            <FormattedMessage
              id="paymentRequest.action.edit"
              defaultMessage="Edit Payment Request"
            />
          ) : (
            <FormattedMessage
              id="paymentRequest.action.create"
              defaultMessage="Create Payment Request"
            />
          ),
          onClick: () => {
            formRef.current?.submit()
          },
          variant: 'contained',
          color: 'secondary'
        }
      ]}
    >
      <PaymentRequestForm
        ref={formRef}
        onSubmit={onSuccess}
        completed={completed}
        paymentRequest={paymentRequest}
      />
    </Drawer>
  )
}

export default PaymentRequestDrawer
