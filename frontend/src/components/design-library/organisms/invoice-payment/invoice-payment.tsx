import React from 'react';
import { Button } from '@material-ui/core';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import { BillingInfoCard } from '../../molecules/billing-info-card/billing-info-card'
import ReactPlaceholder from 'react-placeholder';
import { countryCodesFull } from '../../../profile/country-codes'
import { formatCurrency } from '../../../../utils/format-currency'
import {
  Alert, AlertTitle
} from '@material-ui/lab'

const styles = (theme: Theme) =>
  createStyles({
    btnPayment: {
      float: 'right',
      marginTop: 10
    },
  })

const InvoicePayment = ({
  price,
  customer,
  onInvoicePayment,
  onInfoClick,
  classes
}) => {

  const { name, address } = customer.data

  return (
    <>
      <div style={ { marginTop: 10, marginBottom: 10 } }>
        <Alert
          severity='info'
          action={
            <Button
              size='small'
              onClick={onInfoClick}
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
          totalAmount={price}
        />
      </ReactPlaceholder>
      <Button
        disabled={!price}
        onClick={onInvoicePayment}
        variant='contained'
        color='secondary'
        className={classes.btnPayment}
      >
        <FormattedMessage id='fund.payment.invoice.action' defaultMessage='Generate a {amount} invoice' values={{
          amount: formatCurrency(price)
        }} />
      </Button>
    </>
  )
}

export default withStyles(styles)(InvoicePayment)