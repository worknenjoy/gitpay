import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import LoginButton from '../../../../session/login-button'
import { InjectedIntlProps } from 'react-intl'
import InvoicePayment from '../../../../design-library/organisms/invoice-payment/invoice-payment'

interface PaymentMethodInvoiceTabProps extends RouteComponentProps, InjectedIntlProps {
  price: any;
  priceAfterFee: any;
  customer: any;
  user: any;
  task: any;
  createOrder: any;
  fetchCustomer: any;
  onPayment: () => void;
}

interface MatchParams {
  organization_id?: string;
  project_id?: string;
  filter?: string;
}

const PaymentMethodInvoiceTab: React.FC<PaymentMethodInvoiceTabProps & { match: { params: MatchParams } }> = ({
  priceAfterFee,
  price,
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

  if (!user.id) return <div style={{marginTop: 10, marginBottom: 10}}><LoginButton referrer={location} includeForm classes={{gutterLeft: '0px'}} /></div>;

  return (
    <InvoicePayment 
      price={priceAfterFee}
      customer={customer}
      onInvoicePayment={onInvoicePayment}
      onInfoClick={ () => history.push('/profile/user-account/customer') }
    />
  )
}

export default withRouter(PaymentMethodInvoiceTab);