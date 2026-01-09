import React from 'react'
import styled, { css } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import { RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import LoginFormSignin from '../login-form-signin/login-form-signin'
import LoginFormSignup from '../login-form-signup/login-form-signup'
import LoginFormReset from '../login-form-reset/login-form-reset'
import LoginFormForgot from '../login-form-forgot/login-form-forgot'

const styles = (theme: any) => ({
  gutterLeft: {
    marginLeft: 10
  }
})

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

  contrast?: boolean
  includeForm?: boolean
  hideExtra?: boolean
  size?: 'large' | 'medium' | 'small'
  mode?: string
  onClose?: () => void
  noCancelButton?: boolean
  user?: { email: string }
  onForgot?: () => void
  onSignup?: () => void
  onSignin?: () => void
  loginFormSignupFormProps?: any
  loginFormForgotFormProps?: any
}

const LoginForm: React.FC<LoginButtonProps> = ({
  contrast,
  mode = 'signin',
  user,
  onClose,
  onForgot,
  onSignup,
  onSignin,
  loginFormSignupFormProps,
  loginFormForgotFormProps
}) => {
  return (
    <Wrapper contrast={contrast}>
      <Content>
        <div>
          {mode !== 'reset' ? (
            <>
              <Typography
                variant="h5"
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
                variant="body1"
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
                <FormattedMessage id="account.login.title" defaultMessage="Recover your password" />
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
          {mode === 'signin' && (
            <LoginFormSignin onClose={onClose} onForgot={onForgot} onSignup={onSignup} />
          )}
          {mode === 'signup' && (
            <LoginFormSignup onClose={onClose} onSignin={onSignin} {...loginFormSignupFormProps} />
          )}
          {mode === 'forgot' && (
            <LoginFormForgot onClose={onClose} onSignin={onSignin} {...loginFormForgotFormProps} />
          )}
          {mode === 'reset' && <LoginFormReset onClose={onClose} />}
        </div>
      </Content>
    </Wrapper>
  )
}

export default LoginForm
