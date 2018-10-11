import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import AccountContainer from '../../containers/account'

class PaymentOptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      cards: []
    }

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange (event, value) {
    this.setState({ tab: value })
  }

  render () {
    return (
      <Paper elevation={ 0 }>
        <Typography variant='headline' component='h3'>
          <FormattedMessage id='payment.headline' defaultMessage='Payment' />
        </Typography>
        <Typography component='p' style={ { marginBottom: 40 } }>
          <FormattedMessage id='payment.options.description' defaultMessage='Setup your payment and your bank account to receive the payments of your tasks concluded' />
        </Typography>
        <AccountContainer />
      </Paper>
    )
  }
}
export default withRouter(PaymentOptions)
