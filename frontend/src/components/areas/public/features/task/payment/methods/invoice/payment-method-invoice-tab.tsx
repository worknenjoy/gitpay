import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import LoginButton from '../../../../../../profile/components/session/login-button'
import { useIntl } from 'react-intl'
import InvoicePayment from '../../../../../../../design-library/organisms/invoice-payment/invoice-payment'

interface PaymentMethodInvoiceTabProps extends RouteComponentProps {
  price: any;
  priceAfterFee: any;
  customer: any;
  user: any;
  task: any;
  createOrder: any;
  fetchCustomer: any;
  history: any;
  location: any;
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
  const intl = useIntl()
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
      },
      plan: 'open source',
    })
    onPayment()
  }

  useEffect(() => {
    user.id && fetchCustomer(user.id);
  }, []);

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