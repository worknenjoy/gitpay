import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import {
  Paper,
  Typography,
} from '@material-ui/core'

import AccountContainer from '../../containers/account'

class PaymentOptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      cards: [],
      notification: false
    }
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value })
  }

  handleClose = (event) => {
    this.setState({ notification: false })
  }

  render () {
    return (
      <Paper elevation={ 0 }>
        <Typography variant='h5' component='h3' style={ { marginBottom: 10, marginTop: 20 } }>
          <FormattedMessage id='payment.headline' defaultMessage='Bank account' />
        </Typography>
        <Typography component='p' color='textSecondary' style={ { marginBottom: 5 } }>
          <FormattedMessage id='payment.options.description.title' defaultMessage='Setup payouts for your issues completed' />
        </Typography>
        <AccountContainer />
      </Paper>
    )
  }
}
export default withRouter(PaymentOptions)
