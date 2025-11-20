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
  price,
  priceAfterFee,
  customer,
  history,
  onPay,
}) => {
  const onInvoicePayment = async () => {
    await onPay(priceAfterFee)
  }

  useEffect(() => {}, [])

  return (
    <InvoicePayment
      price={priceAfterFee}
      customer={customer}
      onInvoicePayment={onInvoicePayment}
      onInfoClick={() => history.push('/profile/user-account/customer')}
    />
  )
}

export default withRouter(AddFundsInvoiceTab)
