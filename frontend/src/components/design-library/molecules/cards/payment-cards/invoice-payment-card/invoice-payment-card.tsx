import React, { useEffect } from 'react'
import InvoicePayment from 'design-library/organisms/forms/invoice-forms/invoice-payment/invoice-payment'

interface InvoicePaymentCardProps {
  price: any
  priceAfterFee: any
  customer: any
  user: any
  task: any
  createOrder: any
  fetchCustomer: any
  onPayment: () => void
}

const InvoicePaymentCard: React.FC<InvoicePaymentCardProps> = ({
  priceAfterFee,
  price,
  fetchCustomer,
  customer,
  user,
  task,
  createOrder,
  onPayment
}) => {
  const [processingPayment, setProcessingPayment] = React.useState(false)

  const onInvoicePayment = async () => {
    setProcessingPayment(true)
    await createOrder({
      provider: 'stripe',
      amount: price,
      userId: user?.id,
      email: user?.email,
      taskId: task.id,
      currency: 'usd',
      status: 'open',
      source_type: 'invoice-item',
      customer_id: user?.customer_id,
      metadata: {
        user_id: user.id
      },
      plan: 'open source'
    })
    onPayment()
    setProcessingPayment(false)
  }

  useEffect(() => {
    user.id && fetchCustomer(user.id)
  }, [])

  return (
    <InvoicePayment
      price={priceAfterFee}
      customer={customer}
      onInvoicePayment={onInvoicePayment}
      processingPayment={processingPayment}
    />
  )
}

export default InvoicePaymentCard
