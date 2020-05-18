import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Auth from '../../modules/auth'

import {
  Button,
  Typography,
  withStyles
} from '@material-ui/core'

import { withRouter } from 'react-router-dom'

import LoginFormContainer from '../../containers/login-form'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

import api from '../../consts'
// import { IncomingMessage } from 'http'

const styles = theme => ({
  gutterLeft: {
    marginLeft: 10
  }
})

const Wrapper = styled.div`
  ${props => props.contrast && css`
    color: white;
  `}
`

const Content = styled.div`
  margin-top: 10px;
`

class LoginButton extends Component {
  componentWillMount () {
    if (this.props.referer) {
      Auth.storeReferer(this.props.referer.pathname)
    }
    if (this.props.location && this.props.location.state && this.props.location.state.from) {
      const referer = this.props.location.state.from.pathname
      if (referer) {
        Auth.storeReferer(referer)
      }
    }
  }

  render () {
    const { classes, contrast, size, includeForm } = this.props

    return (
      <Wrapper contrast={ contrast }>
        <Content>
          { includeForm && (
            <div>
              <Typography type='body1' color={ contrast ? 'inherit' : 'default' } gutterBottom noWrap>
                <FormattedMessage id='account.login.connect.form' defaultMessage='Connect or signup with your account' />
              </Typography>
              <LoginFormContainer />
            </div>
          ) }

          <div style={ { textAlign: 'center' } }>
            <Typography type='body1' color={ contrast ? 'inherit' : 'default' } gutterBottom>
              <FormattedMessage id='account.login.connect.provider' defaultMessage='You can also connect or signup with your existing account from other services' />
            </Typography>
          </div>
          <div style={ { display: 'flex', justifyContent: 'center', marginTop: 10 } }>
            <div>
              <Button
                style={ { marginRight: 10 } }
                href={ `${api.API_URL}/authorize/github` }
                variant='contained'
                size={ size }
                color='secondary'
              >
                <img width='16' src={ logoGithub } />
                <span className={ classes.gutterLeft }>Github</span>
              </Button>
              <Button
                href={ `${api.API_URL}/authorize/bitbucket` }
                variant='contained'
                size={ size }
                color='secondary'
              >
                <img width='16' src={ logoBitbucket } />
                <span className={ classes.gutterLeft }>Bitbucket</span>
              </Button>
            </div>
          </div>
        </Content>
      </Wrapper>
    )
  }
}

LoginButton.propTypes = {
  classes: PropTypes.object.isRequired,
  referer: PropTypes.object,
  contrast: PropTypes.bool,
  includeForm: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small'])
}

LoginButton.defaultProps = {
  size: 'large'
}

export default withRouter(withStyles(styles)(LoginButton))
