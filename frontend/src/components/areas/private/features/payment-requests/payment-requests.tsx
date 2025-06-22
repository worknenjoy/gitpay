import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Paper,
  Container,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import EmptyPaymentRequest from 'design-library/molecules/content/empty/empty-payment-request/empty-payment-request'

const useStyles = makeStyles(theme => ({
  icon: {
    backgroundColor: 'black'
  },
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  }
}))

const PaymentRequests = ({ paymentRequests, listPaymentRequests, user }) => {
  const classes = useStyles()
  const { completed, data } = paymentRequests

  useEffect(() => {
    listPaymentRequests()
  }, [])

  return (
    
      <Container>
        <Typography variant="h5" gutterBottom style={{ marginTop: 40 }}>
          <FormattedMessage id="payment.requests.title" defaultMessage="Payment requests" />
        </Typography>
        <Typography variant="caption" gutterBottom>
          <FormattedMessage
            id="payment.requests.description"
            defaultMessage="Here you can see all the payments requests on our account"
          />
        </Typography>
        <Paper>
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginTop: 20, marginBottom: 20, padding: 20 }}>
              {data.length === 0 ? (
                <EmptyPaymentRequest onActionClick={() => { }} />
              ) : (
                <></>
              )}
            </div>
          </div>
        </Paper>
      </Container>
  )
}

export default PaymentRequests
