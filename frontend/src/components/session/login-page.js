import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'
import LoginButton from './login-button'
import { withStyles, Card, CardContent } from '@material-ui/core'

import Background from '../../images/login_bg.png'
const styles = theme => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    backgroundImage: `url(${Background})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  card: {
    width: '50%',
    marginTop: 50,
    opacity: 0.7
  },
  cardContent: {
    textAlign: 'center'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

const Content = styled.div`
  margin-top: 10px;
`

const logo = require('../../images/logo-complete.png')

class LoginPage extends Component {
  componentDidMount () {
    if (this.props.match && this.props.match.params.status === 'invalid') {
      this.props.addNotification && this.props.addNotification('user.invalid')
    }
  }

  render () {
    const { classes, match } = this.props
    return (
      <div className={ classes.container }>
        <Card className={ classes.card }>
          <CardContent className={ classes.cardContent }>
            <Link to='/'>
              <img src={ logo } width={ 280 } />
            </Link>
            <Content>
              <LoginButton includeForm mode={match.params.mode}  />
            </Content>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(LoginPage))
