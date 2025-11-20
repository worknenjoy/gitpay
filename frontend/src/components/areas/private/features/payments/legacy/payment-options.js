import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { Paper, Typography } from '@mui/material'

import AccountContainer from '../../../../../../containers/account'

class PaymentOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
      cards: [],
      notification: false,
    }
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value })
  }

  handleClose = (event) => {
    this.setState({ notification: false })
  }

  render() {
    return (
      <Paper elevation={1} style={{ padding: 20 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          <FormattedMessage id="payment.options.headline" defaultMessage="Payout settings" />
        </Typography>
        <Typography component="p" color="textSecondary" style={{ marginBottom: 5 }}>
          <FormattedMessage
            id="payment.options.description.title"
            defaultMessage="Setup payouts for your issues completed"
          />
        </Typography>
        <AccountContainer />
      </Paper>
    )
  }
}
export default withRouter(PaymentOptions)
