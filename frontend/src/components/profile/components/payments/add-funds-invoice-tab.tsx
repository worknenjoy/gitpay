import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { formatCurrency } from '../../../../utils/format-currency'
import InvoicePayment from '../../../design-library/organisms/invoice-payment/invoice-payment'

const AddFundsInvoiceTab = ({
  price,
  customer,
  history
}) => {

  const onInvoicePayment = async () => {
    
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