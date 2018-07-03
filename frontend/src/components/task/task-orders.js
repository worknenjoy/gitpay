import React, { Component } from 'react'
import {
  Redirect, BrowserRouter as Router
} from "react-router-dom";


class TaskOrders extends Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () {
    this.props.history.replace(`/#/task/${this.props.match.params.id}`)
    this.props.addNotification('Seu pagamento foi efetuado com sucesso')
    this.props.changeTab(1)
  }

  render () {

    return (
      <div>
        <Router>
          <Redirect
            to={{
              pathname: `/#/task/${this.props.match.params.id}`,
              state: { from: this.props.location }
            }}
          />
        </Router>
      </div>
    )
  }
}

export default TaskOrders
