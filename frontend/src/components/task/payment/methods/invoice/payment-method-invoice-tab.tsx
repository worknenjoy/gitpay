import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { BillingInfoCard } from './payment-method-invoice-billing-info'
import ReactPlaceholder from 'react-placeholder';
import { withRouter } from 'react-router-dom'
import {
  Alert, AlertTitle
} from '@material-ui/lab'
import { countryCodesFull } from '../../../../profile/country-codes';
import LoginButton from '../../../../session/login-button'

const PaymentMethodInvoiceTab = ({
  classes,
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
    <>
      <div style={ { marginTop: 10, marginBottom: 10 } }>
        <Alert
          severity='info'
          action={
            <Button
              size='small'
              onClick={ () => {
                history.push('/profile/user-account/customer')
              } }
              variant='contained'
              color='secondary'
            >
              <FormattedMessage id='issue.payment.invoice.info.action' defaultMessage='Update billing information before continue' />
            </Button>
          }
        >
          <AlertTitle>
            <FormattedMessage id='issue.payment.invoice.info.title' defaultMessage='Billing information on your invoice' />
          </AlertTitle>
          <FormattedMessage id='issue.payment.invoice.info.description' defaultMessage='To update your billing information, please fill in or update your details in the Billing Information section of your account settings. This information will be used to generate your invoice' />
        </Alert>
      </div>
      <ReactPlaceholder
        showLoadingAnimation={true}
        type='media'
        ready={customer.completed}
        rows={5}
      >
        <BillingInfoCard
          name={name || ' - '}
          address={`${address?.line1 || ' - '} ${address?.line2 || ' - '}`}
          city={address?.city || ' - '}
          state={address?.state || ' - '}
          zipCode={address?.postal_code || ' - '}
          country={countryCodesFull.find(c => c.code === address?.country)?.country || ' - '}
          totalAmount={priceAfterFee}
        />
      </ReactPlaceholder>
      <Button
        disabled={!priceAfterFee}
        onClick={onInvoicePayment}
        variant='contained'
        color='secondary'
        className={classes.btnPayment}
      >
        <FormattedMessage id='task.payment.invoice.action' defaultMessage='Pay {amount} with Invoice' values={{
          amount: formatCurrency(priceAfterFee)
        }} />
      </Button>
    </>
  )
}

export default withRouter(PaymentMethodInvoiceTab);