import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Paper,
  Container,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

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

const PaymentRequests = ({ paymentRequests, getPaymentRequests, user }) => {
  const classes = useStyles()

  useEffect(() => {
    getPaymentRequests()
  }, [])

  return (
    <Paper elevation={0} style={{ backgroundColor: 'transparent' }}>
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
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <></>
          </div>
        </div>
      </Container>
    </Paper>
  )
}

export default PaymentRequests
