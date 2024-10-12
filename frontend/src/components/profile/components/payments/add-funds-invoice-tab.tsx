import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import InvoicePayment from '../../../design-library/organisms/invoice-payment/invoice-payment'

const AddFundsInvoiceTab = ({
  price,
  priceAfterFee,
  customer,
  history,
  onPay
}) => {

  const onInvoicePayment = async () => {
    await onPay(price)
  }

  useEffect(() => {
    
  }, []);

  return (
    <InvoicePayment 
      price={price}
      customer={customer}
      onInvoicePayment={onInvoicePayment}
      onInfoClick={ () => history.push('/profile/user-account/customer') }
    />
  )
}

export default withRouter(AddFundsInvoiceTab);