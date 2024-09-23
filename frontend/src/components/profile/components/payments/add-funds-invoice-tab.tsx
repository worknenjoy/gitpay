import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { formatCurrency } from '../../../../utils/format-currency'
import LoginButton from '../../../session/login-button'
import InvoicePayment from '../../../design-library/organisms/invoice-payment/invoice-payment'

const AddFundsInvoiceTab = ({
  price,
  fetchCustomer,
  customer,
  user,
  history
}) => {

  const onInvoicePayment = async () => {
    
  }

  useEffect(() => {
    user.id && fetchCustomer(user.id);
  }, [fetchCustomer, user]);

  return (
    <InvoicePayment 
      price={formatCurrency(price)}
      customer={customer}
      onInvoicePayment={onInvoicePayment}
      onInfoClick={ () => history.push('/profile/user-account/customer') }
    />
  )
}

export default withRouter(AddFundsInvoiceTab);