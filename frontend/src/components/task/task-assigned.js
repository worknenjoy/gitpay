import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Collapse from 'material-ui/transitions/Collapse'

class TaskAssigned extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPrice: 0,
      finalPrice: 0,
      orderPrice: 0,
      samplePrice: 0
    }
  }

  pickTaskPrice = (price) => {
    this.setState({
      currentPrice: price,
      finalPrice: parseInt(price) + parseInt(this.state.orderPrice)
    })
  }

  handleInputChange = (e) => {
    this.setState({ currentPrice: e.target.value })
  }

  handlePayment = (value) => {
    
  }

  render () {
    const { open, user } = this.props

    return (
      <div>
        <Collapse in={ !!open }>
          {user.id}aaa
        </Collapse>
      </div>
    )
  }
}

TaskAssigned.propTypes = {
  open: PropTypes.bool,
  user: PropTypes.object
}

export default TaskAssigned
