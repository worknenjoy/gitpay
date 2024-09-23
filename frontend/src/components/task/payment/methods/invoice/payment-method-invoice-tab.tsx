import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import LoginButton from '../../../../session/login-button'
import InvoicePayment from '../../../../design-library/organisms/invoice-payment/invoice-payment'

const PaymentMethodInvoiceTab = ({
  priceAfterFee,
  price,
  formatCurrency,
  fetchCustomer,
  customer,
  user,
  task,
  createOrder,
  onPayment,
  history,
  location
}) => {

  const { name, address } = customer.data

  const onInvoicePayment = async () => {
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
        user_id: user.id,
      }
    })
    onPayment()
  }

  useEffect(() => {
    user.id && fetchCustomer(user.id);
  }, [fetchCustomer, user]);

  if (!user.id) return <div style={{marginTop: 10, marginBottom: 10}}><LoginButton referer={location} includeForm /></div>;

  return (
    <InvoicePayment 
      price={formatCurrency(priceAfterFee)}
      customer={customer}
      onInvoicePayment={onInvoicePayment}
      onInfoClick={ () => history.push('/profile/user-account/customer') }
    />
  )
}

export default withRouter(PaymentMethodInvoiceTab);