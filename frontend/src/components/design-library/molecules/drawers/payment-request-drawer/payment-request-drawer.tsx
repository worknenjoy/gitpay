import React, { useRef } from 'react'
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
  paymentRequest,
}) => {
  const { completed: paymentRequestCompleted, data } = paymentRequest || {}
  const formRef = useRef<{ submit: () => void }>(null)

  const isEditMode = data?.id

  return (
    <Drawer
      completed={completed}
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit Payment Request' : 'New Payment Request'}
      subtitle="Please fill out the form to request payment"
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'text',
        },
        {
          label: isEditMode ? 'Edit Payment Request' : 'Create Payment Request',
          onClick: () => {
            formRef.current?.submit()
          },
          variant: 'contained',
          color: 'secondary',
        },
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
