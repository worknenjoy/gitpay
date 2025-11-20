import React, { useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import moment from 'moment'
import { Container, Typography, Chip } from '@mui/material'
import CustomPaginationActionsTable from './payout-table'

//Define messages for internationalization
const payoutMessages = defineMessages({
  title: {
    id: 'profile.payouts.title',
    defaultMessage: 'Payouts'
  },
  headerStatus: {
    id: 'profile.payouts.headerStatus',
    defaultMessage: 'Status'
  },
  headerMethod: {
    id: 'profile.payouts.headerMethod',
    defaultMessage: 'Method'
  },
  headerValue: {
    id: 'profile.payouts.headerValue',
    defaultMessage: 'Value'
  },
  headerCreated: {
    id: 'profile.payouts.headerCreated',
    defaultMessage: 'Created'
  }
})

//Map for currency symbols
const currencyMap = {
  usd: '$', // US Dollar
  eur: '€', // Euro
  gbp: '£', // British Pound
  jpy: '¥', // Japanese Yen
  cny: '¥', // Chinese Yuan
  inr: '₹', // Indian Rupee
  aud: 'A$', // Australian Dollar
  cad: 'C$', // Canadian Dollar
  chf: 'F', // Swiss Franc
  mxn: 'Mex$', // Mexican Peso
  nzd: 'NZ$', // New Zealand Dollar
  hkd: 'HK$', // Hong Kong Dollar
  sgd: 'S$', // Singapore Dollar
  krw: '₩', // South Korean Won
  cop: 'COL$', // Colombian Peso
  php: '₱', // Philippine Peso
  huf: 'Ft' // Hungarian Forint
}

//Function to convert currency code to symbol
function currencyCodeToSymbol(code) {
  return currencyMap[code.toLowerCase()] || code
}

//Function to format amount from cents to decimal format
function formatStripeAmount(amountInCents) {
  // Convert to a number in case it's a string
  let amount = Number(amountInCents)

  // Check if the conversion result is a valid number
  if (isNaN(amount)) {
    return 'Invalid amount'
  }

  // Convert cents to a decimal format and fix to 2 decimal places
  return (amount / 100).toFixed(2)
}

// removed withStyles

const Payouts = ({ searchPayout, payouts, user, intl }) => {
  useEffect(() => {
    const getPayouts = async () => await searchPayout({ userId: user.id })
    getPayouts().then((t) => {})
  }, [user])

  return (
    <div style={{ margin: '40px 0' }}>
      <Container>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage {...payoutMessages.title} />
        </Typography>
        <div>
          <CustomPaginationActionsTable
            tableHead={[
              intl.formatMessage(payoutMessages.headerStatus),
              intl.formatMessage(payoutMessages.headerMethod),
              intl.formatMessage(payoutMessages.headerValue),
              intl.formatMessage(payoutMessages.headerCreated)
            ]}
            payouts={
              (payouts &&
                payouts.data && {
                  ...payouts,
                  data: payouts.data.map((t) => [
                    <Chip label={t.status} />,
                    <Typography variant="body2">{t.method}</Typography>,
                    `${currencyCodeToSymbol(t.currency)} ${t.method === 'stripe' ? formatStripeAmount(t.amount) : t.amount}`,
                    moment(t.createdAt).format('LLL')
                  ])
                }) ||
              {}
            }
          />
        </div>
      </Container>
    </div>
  )
}

export default injectIntl(Payouts)
