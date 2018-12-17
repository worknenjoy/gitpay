import React, { Component } from 'react'
import styled from 'styled-components'
import { withStyles } from 'material-ui/styles'
import { withRouter, Link } from 'react-router-dom'
import Card from 'material-ui/Card'
import CardContent from 'material-ui/Card/CardContent'
import cyan from 'material-ui/colors/cyan'
import LoginButton from './login-button'

const styles = theme => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: cyan[500]
  },
  card: {
    width: '50%',
    marginTop: 50
  },
  cardContent: {
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  }
})

const Content = styled.div`
  margin-top: 10px;
`

const logo = require('../../images/logo-complete-gray.png')

class LoginPage extends Component {
  componentDidMount () {
    if (this.props.match && this.props.match.params.status === 'invalid') {
      this.props.addNotification && this.props.addNotification('user.invalid')
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div className={ classes.container }>
        <Card className={ classes.card }>
          <CardContent className={ classes.cardContent }>
            <Link to='/'>
              <img src={ logo } width={ 200 } />
            </Link>
            <Content>
              <LoginButton includeForm />
            </Content>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(LoginPage))
