import React from 'react'
import { Button, Skeleton } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { CustomAlert } from '../../../../atoms/alerts/alert/alert'
import { BillingInfoCard } from '../../../../molecules/cards/billing-info-card/billing-info-card'
import { countryCodes } from '../../../../../areas/private/shared/country-codes'
import { formatCurrency } from '../../../../../../utils/format-currency'
import { InfoAlertWrapper, StyledPayButton } from './invoice-payment.styles'
import { useHistory } from 'react-router-dom'

const InvoicePayment = ({ price, customer, onInvoicePayment, processingPayment = false }) => {
  const history = useHistory()
  const { data, completed } = customer
  const { name, address } = data

  const onInfoClick = () => {
    history.push('/profile/invoice-settings')
  }

  return (
    <>
      <InfoAlertWrapper>
        <CustomAlert
          slotProps={{
            action: {
              sx: { padding: 0 }
            }
          }}
          completed={completed}
          severity="info"
          message={
            <FormattedMessage
              id="issue.payment.invoice.info"
              defaultMessage="Invoices are generated based on the billing information in your account settings."
            />
          }
          action={
            <Button size="small" onClick={onInfoClick} variant="contained" color="secondary">
              <FormattedMessage
                id="issue.payment.invoice.info.action.update"
                defaultMessage="Update invoice settings"
              />
            </Button>
          }
        >
          <FormattedMessage
            id="issue.payment.invoice.settings.info.description"
            defaultMessage="To update the information to generate your invoice, please fill in or update your details in the Invoice Settings section of your account. This information will be used to generate your invoice"
          />
        </CustomAlert>
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
        size="small"
        disabled={!price}
        onClick={onInvoicePayment}
        variant="contained"
        color="secondary"
        label={
          <FormattedMessage
            id="fund.payment.invoice.action"
            defaultMessage="Generate a {amount} invoice"
            values={{
              amount: formatCurrency(price)
            }}
          />
        }
        completed={!processingPayment && customer.completed}
      />
    </>
  )
}

export default InvoicePayment
