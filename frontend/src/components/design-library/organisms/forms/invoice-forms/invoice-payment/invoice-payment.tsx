import React from 'react'
import { Button, Skeleton } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { BillingInfoCard } from '../../../../molecules/cards/billing-info-card/billing-info-card'
import { countryCodes } from '../../../../../areas/private/shared/country-codes'
import { formatCurrency } from '../../../../../../utils/format-currency'
import { Alert, AlertTitle } from '@mui/material'
import { InfoAlertWrapper, StyledPayButton } from './invoice-payment.styles'

// No component-level JSS; using styled components defined in invoice-payment.styles.ts

const InvoicePayment = ({
  price,
  customer,
  onInvoicePayment,
  onInfoClick,
  processingPayment = false,
}) => {
  const { data, completed } = customer
  const { name, address } = data

  return (
    <>
      <InfoAlertWrapper>
        <Alert
          severity="info"
          action={
            <Button size="small" onClick={onInfoClick} variant="contained" color="secondary">
              <FormattedMessage
                id="issue.payment.invoice.info.action"
                defaultMessage="Update billing information before continue"
              />
            </Button>
          }
        >
          <AlertTitle>
            <FormattedMessage
              id="issue.payment.invoice.info.title"
              defaultMessage="Billing information on your invoice"
            />
          </AlertTitle>
          <FormattedMessage
            id="issue.payment.invoice.info.description"
            defaultMessage="To update your billing information, please fill in or update your details in the Billing Information section of your account settings. This information will be used to generate your invoice"
          />
        </Alert>
      </InfoAlertWrapper>
      {completed ? (
        <BillingInfoCard
          name={name || ' - '}
          address={`${address?.line1 || ' - '} ${address?.line2 || ' - '}`}
          city={address?.city || ' - '}
          state={address?.state || ' - '}
          zipCode={address?.postal_code || ' - '}
          country={countryCodes.find((c) => c.code === address?.country)?.country || ' - '}
          totalAmount={price}
        />
      ) : (
        <Skeleton variant="rectangular" width="100%" height={118} animation="wave" />
      )}
      <StyledPayButton
        disabled={!price}
        onClick={onInvoicePayment}
        variant="contained"
        color="secondary"
        label={
          <FormattedMessage
            id="fund.payment.invoice.action"
            defaultMessage="Generate a {amount} invoice"
            values={{
              amount: formatCurrency(price),
            }}
          />
        }
        completed={!processingPayment}
      />
    </>
  )
}

export default InvoicePayment
