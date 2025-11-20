import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Auth from '../../../../../modules/auth'

import { Typography } from '@mui/material'

import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'

import LoginFormContainer from '../../../../../containers/login-form'

// removed legacy withStyles usage

const Wrapper = styled.div<{ contrast?: boolean }>`
  ${(props) =>
    props.contrast &&
    css`
      color: white;
    `}
`

const Content = styled.div`
  margin-top: 0;
`

interface LoginButtonProps extends RouteComponentProps {
  referrer?: Location
  location: any
  contrast?: boolean
  includeForm?: boolean
  hideExtra?: boolean
  size?: 'large' | 'medium' | 'small'
  mode?: string
  onClose?: () => void
  noCancelButton?: boolean
  user?: { email: string }
}

class LoginButton extends Component<LoginButtonProps> {
  static defaultProps: Partial<LoginButtonProps> = {
    size: 'large'
  }

  componentWillMount() {
    if (this.props.referrer) {
      Auth.storeReferrer(this.props.referrer.pathname)
    }
    if (
      this.props.location &&
      this.props.location.state &&
      (this.props.location.state as any).from
    ) {
      const referrer = (this.props.location.state as { from: { pathname: string } }).from.pathname
      if (referrer) {
        Auth.storeReferrer(referrer)
      }
    }
  }

  render() {
    const { contrast, size, includeForm, hideExtra, mode, onClose, noCancelButton, user } =
      this.props

    return (
      <Wrapper contrast={contrast}>
        <Content>
          {includeForm && (
            <div>
              {mode !== 'reset' ? (
                <>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 'bold' }}
                    color={contrast ? 'inherit' : 'primary'}
                    gutterBottom
                  >
                    <FormattedMessage
                      id="account.login.title.welcome"
                      defaultMessage="Welcome to Gitpay!"
                    />
                  </Typography>
                  <Typography
                    style={{ marginBottom: 20 }}
                    variant="body2"
                    color={contrast ? 'inherit' : 'primary'}
                    gutterBottom
                    noWrap
                  >
                    <FormattedMessage
                      id="account.login.connect.form"
                      defaultMessage="Connect or signup with your account"
                    />
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="caption"
                    style={{ fontWeight: 'bold' }}
                    color={contrast ? 'inherit' : 'primary'}
                    gutterBottom
                  >
                    <FormattedMessage
                      id="account.login.title.welcome.recover"
                      defaultMessage="Welcome back to Gitpay!"
                    />
                  </Typography>
                  <Typography
                    style={{ marginBottom: 20 }}
                    variant="h5"
                    color={contrast ? 'inherit' : 'primary'}
                    gutterBottom
                    noWrap
                  >
                    {user?.email}
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 'bold' }}
                    color={contrast ? 'inherit' : 'primary'}
                    gutterBottom
                  >
                    <FormattedMessage
                      id="account.login.title"
                      defaultMessage="Recover your password"
                    />
                  </Typography>
                  <Typography
                    style={{ marginBottom: 20 }}
                    variant="body1"
                    color={contrast ? 'inherit' : 'primary'}
                    gutterBottom
                    noWrap
                  >
                    <FormattedMessage
                      id="account.login.connect.form.reset"
                      defaultMessage="To reset your password, type the new password and confirm"
                    />
                  </Typography>
                </>
              )}
              <LoginFormContainer mode={mode} onClose={onClose} noCancelButton={noCancelButton} />
            </div>
          )}
        </Content>
      </Wrapper>
    )
  }
}

export default withRouter(LoginButton as React.ComponentType<LoginButtonProps>)
