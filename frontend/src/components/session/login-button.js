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
  margin-top: 0;
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
    const { classes, contrast, size, includeForm, hideExtra, mode, onClose, noCancelButton, user } = this.props

    return (
      <Wrapper contrast={ contrast }>
        <Content>
          { includeForm && (
            <div>
              { mode !== 'reset' ? (  
                <>
                  <Typography variant='h5' style={ { fontWeight: 'bold' } } color={ contrast ? 'inherit' : 'default' } gutterBottom>
                    <FormattedMessage id='account.login.title.welcome' defaultMessage='Welcome to Gitpay!' />
                  </Typography>
                  <Typography style={ { marginBottom: 20 } } variant='body1' color={ contrast ? 'inherit' : 'default' } gutterBottom noWrap>
                    <FormattedMessage id='account.login.connect.form' defaultMessage='Connect or signup with your account' />
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant='caption' style={ { fontWeight: 'bold' } } color={ contrast ? 'inherit' : 'default' } gutterBottom>
                    <FormattedMessage id='account.login.title.welcome.recover' defaultMessage='Welcome back to Gitpay!' />
                  </Typography>
                  <Typography style={ { marginBottom: 20 } } variant='h5' color={ contrast ? 'inherit' : 'default' } gutterBottom noWrap>
                    { this.props?.user?.email }
                  </Typography>
                  <Typography variant='h6' style={ { fontWeight: 'bold' } } color={ contrast ? 'inherit' : 'default' } gutterBottom>
                    <FormattedMessage id='account.login.title' defaultMessage='Recover your password' />
                  </Typography>
                  <Typography style={ { marginBottom: 20 } } variant='body1' color={ contrast ? 'inherit' : 'default' } gutterBottom noWrap>
                    <FormattedMessage id='account.login.connect.form.reset' defaultMessage='To reset your password, type the new password and confirm' />
                  </Typography>
                </>
              ) }
              <LoginFormContainer mode={ mode } onClose={ onClose } noCancelButton={ noCancelButton } />
            </div>
          ) }
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
  hideExtra: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small'])
}

LoginButton.defaultProps = {
  size: 'large'
}

export default withRouter(withStyles(styles)(LoginButton))
