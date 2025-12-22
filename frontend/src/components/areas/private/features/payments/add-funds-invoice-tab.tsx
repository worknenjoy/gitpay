import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import InvoicePayment from 'design-library/organisms/forms/invoice-forms/invoice-payment/invoice-payment'

interface AddFundsInvoiceTabProps extends RouteComponentProps {
  price: any
  history: any
  priceAfterFee: any
  customer: any
  onPay: (amount: any) => Promise<void>
  onClose: () => void
}

const AddFundsInvoiceTab: React.FC<AddFundsInvoiceTabProps> = ({
  priceAfterFee,
  customer,
  onPay
}) => {
  const [ processingPayment, setProcessingPayment ] = React.useState(false)
  const onInvoicePayment = async () => {
    setProcessingPayment(true)
    await onPay(priceAfterFee)
    setProcessingPayment(false)
  }

  useEffect(() => {}, [])

  return (
    <InvoicePayment price={priceAfterFee} customer={customer} onInvoicePayment={onInvoicePayment} processingPayment={processingPayment} />
  )
}

export default withRouter(AddFundsInvoiceTab)
