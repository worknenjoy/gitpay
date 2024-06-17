import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import {
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom'

const messages = defineMessages({
  orderSuccess: {
    id: 'task.order.payment.success',
    defaultMessage: 'Your order was completed successfully'
  },
  orderError: {
    id: 'task.order.payment.error',
    defaultMessage: 'We had an issue processing your payment'
  }
})

class TaskOrders extends Component {
  UNSAFE_componentWillMount() {
    if (this.props.match.params.status === 'success') {
      this.props.addNotification(this.props.intl.formatMessage(messages.orderSuccess))
    } else {
      this.props.addNotification(this.props.intl.formatMessage(messages.orderError))
    }
    this.props.history.replace(`/#/task/${this.props.match.params.id}`)
    this.props.changeTab(1)
  }

  render() {
    return (
      <div>
        <Router>
          <Redirect
            to={ {
              pathname: `/#/task/${this.props.match.params.id}`,
              state: { from: this.props.location }
            } }
          />
        </Router>
      </div>
    )
  }
}

TaskOrders.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  addNotification: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired
}

export default injectIntl(TaskOrders)
