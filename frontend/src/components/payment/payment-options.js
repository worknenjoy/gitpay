import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import {
  Paper,
  Typography,
} from '@material-ui/core'
import { orange } from '@material-ui/core/colors'

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
        <Typography variant='h5' component='h3' style={ { marginBottom: 10 } }>
          <FormattedMessage id='payment.headline' defaultMessage='Payment' />
        </Typography>
        <Typography component='p' color='textSecondary' style={ { marginBottom: 10 } }>
          <FormattedMessage id='payment.options.description' defaultMessage='Setup your bank account to receive the payments of your tasks concluded' />
        </Typography>
        <Typography variant='body1' component='p' color='default' style={ { marginBottom: 20, padding: 10, backgroundColor: orange['100'] } }>
          <FormattedMessage id='payment.options.warning.message' defaultMessage='For now we support bank accounts onboarding in Brazil only. But it is possible to activate your account with Paypal instead.' />
        </Typography>
        <AccountContainer />
      </Paper>
    )
  }
}
export default withRouter(PaymentOptions)
