import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'
import LoginButton from './login-button'
import { FormattedMessage } from 'react-intl'
import { withStyles, Card, CardContent, Typography } from '@material-ui/core'

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
    height: 600,
    marginTop: 50,
    opacity: 0.8
  },
  cardContent: {
    textAlign: 'center'
  },
  title: {
    fontSize: 12
  },
  pos: {
    marginBottom: 10
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
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Card className={ classes.card }>
            <CardContent className={ classes.cardContent }>
              <Link to='/#'>
                <img src={ logo } width={ 210 } />
              </Link>
              <Content>
                <LoginButton includeForm mode={ match.params.mode } noCancelButton />
              </Content>
            </CardContent>
          </Card>
          <div style={{marginTop: 10, textAlign: 'center'}}>
            <Typography variant='caption' color='default' gutterBottom noWrap>
              <FormattedMessage id='account.login.connect.bottom' defaultMessage='© 2023 Gitpay® - All rights reserved' />
            </Typography>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(LoginPage))
