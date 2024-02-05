import React, { useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import slugify from '@sindresorhus/slugify'
import moment from 'moment'
import {
  Container,
  Typography,
  withStyles,
  Chip
} from '@material-ui/core'
import { messages } from '../task/messages/task-messages'
import CustomPaginationActionsTable from './payout-table'

function currencyCodeToSymbol(code) {
  const currencyMap = {
    usd: '$', // US Dollar
    eur: '€', // Euro
    gbp: '£', // British Pound
    jpy: '¥', // Japanese Yen
    cny: '¥', // Chinese Yuan
    inr: '₹', // Indian Rupee
    // Add more currencies here
  };

  return currencyMap[code.toLowerCase()] || code;
}

function formatStripeAmount(amountInCents) {
  // Convert to a number in case it's a string
  let amount = Number(amountInCents);

  // Check if the conversion result is a valid number
  if (isNaN(amount)) {
      return 'Invalid amount';
  }

  // Convert cents to a decimal format and fix to 2 decimal places
  return (amount / 100).toFixed(2);
}

const styles = theme => ({
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  button: {
    width: 100,
    font: 10
  }
})

const Payouts = ({ searchPayout, payouts, user, intl }) => {

  useEffect(() => {
    const getPayouts = async () => await searchPayout({ userId: user.user.id })
    getPayouts().then(t => console.log('payouts:', t))
  }, [user])

  return (
    <div style={ { margin: '40px 0' } }>
      <Container>
        <Typography variant='h5' gutterBottom>
          <FormattedMessage id='profile.payouts.title' defaultMessage='Payouts' />
        </Typography>
        <div>
          <CustomPaginationActionsTable
            tableHead={ [
              intl.formatMessage(messages.cardTableHeaderStatus),
              intl.formatMessage(messages.cardTableHeaderValue),
              intl.formatMessage(messages.cardTableHeaderCreated),
            ] }
            payouts={
              payouts && payouts.data && {
                ...payouts,
                data: payouts.data.map(t => [
                  <Chip label={ t.status } />,
                  `${currencyCodeToSymbol(t.currency)} ${formatStripeAmount(t.amount)}`,
                  moment(t.createdAt).format('LLL')
                ]) } || {}
            }
          />
        </div>
      </Container>
    </div>
  )
}

export default injectIntl(withStyles(styles)(Payouts))
