import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Auth from '../../modules/auth'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

import LoginForm from './login-form'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

import api from '../../consts'

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
    const referer = this.props.referer.pathname
    if (referer) {
      Auth.storeReferer(referer)
    }
  }

  render () {
    const { classes, contrast, size, includeForm } = this.props

    return (
      <Wrapper contrast={ contrast }>
        <Content>
          { includeForm && (
            <div>
              <Typography type='subheading' color={ contrast ? 'inherit' : 'default' } gutterBottom noWrap>
                <FormattedMessage id='account.login.connect.form' defaultMessage='Connect or signup with your account' />
              </Typography>
              <LoginForm />
            </div>
          ) }
          <div style={{textAlign: 'center'}}>
            <Typography type='subheading' color={ contrast ? 'inherit' : 'default' } gutterBottom>
              <FormattedMessage id='account.login.connect.provider' defaultMessage='You can also connect or signup with your existing account from other services' />
            </Typography>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
            <div>
              <Button
                style={ { marginRight: 10 } }
                href={ `${api.API_URL}/authorize/github` }
                variant='raised'
                size={ size }
                color='secondary'
                className={ classes.logButtons }
              >
                <img width='16' src={ logoGithub } />
                <span className={ classes.gutterLeft }>Github</span>
              </Button>
              <Button
                href={ `${api.API_URL}/authorize/bitbucket` }
                variant='raised'
                size={ size }
                color='secondary'
                className={ classes.logButtons }
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

export default withStyles(styles)(LoginButton)
