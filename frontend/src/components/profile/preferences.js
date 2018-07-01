import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

class Preferences extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      cards: []
    }

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentDidMount () {}

  handleTabChange (event, value) {
    this.setState({ tab: value })
  }

  render () {
    return (
      <Paper elevation={ 0 }>
        <Typography variant='headline' component='h3'>
          Preferências
        </Typography>
        <Typography component='p' style={ { marginBottom: 40 } }>
          Aqui você configura algumas preferências para a sua conta
        </Typography>
        <Typography component='p' style={ { marginBottom: 10 } }>
          <strong>Língua:</strong> Português
        </Typography>
        <Typography component='p' style={ { marginBottom: 40 } }>
          <strong>Moeda:</strong> USD (Dólar)
        </Typography>
      </Paper>
    )
  }
}

export default withRouter(Preferences)
