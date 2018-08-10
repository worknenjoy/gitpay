import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Redirect, BrowserRouter as Router
} from 'react-router-dom'

class TaskOrders extends Component {
  componentWillMount () {
    if (this.props.match.params.status === 'success') {
      this.props.addNotification('Seu pagamento foi efetuado com sucesso')
    }
    else {
      this.props.addNotification('Tivemos um problema para completar seu pagamento')
    }
    this.props.history.replace(`/#/task/${this.props.match.params.id}`)
    this.props.changeTab(1)
  }

  render () {
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

export default TaskOrders
