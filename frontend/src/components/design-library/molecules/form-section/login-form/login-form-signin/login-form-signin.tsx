import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Typography } from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha'
import Checkbox from '@mui/material/Checkbox'
import ProviderLoginButtons from '../../../../atoms/buttons/provider-login-buttons/provider-login-buttons'

import api from '../../../../../../consts'
import { Margins, Center, SpacedButton, StyledTextField } from './login-form-signin.styles'
import { useParams } from 'react-router-dom'

type LoginFormSigninProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  action?: string
  onClose?: () => void
  onSignup?: () => void
  noCancelButton?: boolean
  onForgot?: () => void
  addNotification?: (message: string) => void
}

const LoginFormSignin = ({
  onSubmit,
  onClose,
  onSignup,
  noCancelButton,
  onForgot,
  addNotification,
}: LoginFormSigninProps) => {
  const { status } = useParams<{ status: string }>()

  const [state, setState] = useState({
    username: '',
    password: '',
    rememberMe: false,
    captchaChecked: false,
    error: {
      username: '',
      password: '',
      captcha: '',
    },
  })

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value })
  }

  const handleBlur = () => {
    // handle blur logic
  }

  const handleRememberMe = () => {
    setState({ ...state, rememberMe: !state.rememberMe })
  }

  const validateEmail = (email, currentErrors) => {
    if (email.length < 3) {
      setState({
        ...state,
        error: {
          ...currentErrors,
          username: 'Email cannot be empty',
        },
      })
      return false
    } else if (email.length > 72) {
      setState({
        ...state,
        error: {
          ...currentErrors,
          username: 'Email cannot be longer than 72 characters',
        },
      })
      return false
    } else {
      if (
        email &&
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
      ) {
        setState({
          ...state,
          error: {
            ...currentErrors,
            username: 'Invalid email',
          },
        })
        return false
      }
    }
    return true
  }

  const validatePassword = (password, currentErrors) => {
    if (password.length < 3) {
      setState({
        ...state,
        error: {
          ...currentErrors,
          password: 'Password cannot be empty or too short',
        },
      })
      return false
    } else if (password.length > 72) {
      setState({
        ...state,
        error: {
          ...currentErrors,
          password: 'Password cannot be longer than 72 characters',
        },
      })
      return false
    } else {
      return true
    }
  }

  const submitByFormType = (event) => {
    const { captchaChecked } = state
    if (!captchaChecked) {
      setState({ ...state, error: { ...state.error, captcha: 'Please check the captcha' } })
      event && event.preventDefault()
      return false
    }
    const validEmail = validateEmail(state.username, state.error)
    const validPassword = validatePassword(state.password, state.error)
    if (!validEmail || !validPassword) {
      return event && event.preventDefault()
    }
    onSubmit?.(event)
  }

  useEffect(() => {
    process.env.NODE_ENV === 'development' && setState({ ...state, captchaChecked: true })
    process.env.NODE_ENV === 'test' && setState({ ...state, captchaChecked: true })
  }, [])

  useEffect(() => {
    if (status === 'invalid') {
      addNotification && addNotification('user.invalid')
    }
  }, [status, addNotification])

  const { error } = state

  return (
    <form
      onSubmit={submitByFormType}
      action={`${api.API_URL}/authorize/local`}
      method="POST"
      autoComplete="off"
    >
      <Margins>
        <StyledTextField
          name="username"
          onChange={handleChange('username')}
          onBlur={handleBlur}
          fullWidth
          label="E-mail"
          variant="outlined"
          id="username"
          error={!!error.username}
          helperText={error.username}
          defaultValue={state.username}
        />
      </Margins>

      <Margins>
        <StyledTextField
          name="password"
          onChange={handleChange('password')}
          onBlur={handleBlur}
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          id="password"
          error={!!error.password}
          helperText={error.password}
          defaultValue={state.password}
        />
      </Margins>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {state.rememberMe ? (
            <Checkbox checked={state.rememberMe} onClick={handleRememberMe} />
          ) : (
            <Checkbox checked={state.rememberMe} onClick={handleRememberMe} />
          )}
          <Typography variant="caption">
            <FormattedMessage id="account.login.label.remember" defaultMessage="Remember me" />
          </Typography>
        </div>
        <Button
          variant="text"
          style={{ margin: 0, padding: 0, fontSize: 14 }}
          onClick={onForgot}
          component="a"
          size="small"
          color="primary"
        >
          <FormattedMessage id="account.login.label.forgot" defaultMessage="Forgot password?" />
        </Button>
      </div>

      {process.env.NODE_ENV === 'production' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: 80,
            marginTop: 20,
          }}
        >
          <ReCAPTCHA
            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
            onChange={(captchaChecked) => setState({ ...state, captchaChecked })}
          />
        </div>
      )}
      {error.captcha && (
        <div
          style={{
            color: 'red',
            fontSize: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" component="span">
            {error.captcha}
          </Typography>
        </div>
      )}
      <Center style={{ marginTop: 20 }}>
        <div>
          <SpacedButton fullWidth type="submit" size="large" variant="contained" color="primary">
            <FormattedMessage id="account.login.label.signin" defaultMessage="Sign in" />
          </SpacedButton>
          {noCancelButton ? null : (
            <SpacedButton
              onClick={onClose}
              fullWidth
              size="large"
              variant="text"
              color="primary"
              style={{ marginTop: 10 }}
            >
              <FormattedMessage id="account.login.label.cancel" defaultMessage="Cancel" />
            </SpacedButton>
          )}

          <div style={{ marginTop: 10 }}>
            <ProviderLoginButtons />
          </div>

          <div style={{ marginTop: 10 }}>
            <Typography
              variant="body1"
              component="span"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            >
              <FormattedMessage
                id="account.login.label.or.signing"
                defaultMessage="Dont have an account?"
              />
            </Typography>
            <Button onClick={onSignup} variant="text" color="primary" size="large">
              <FormattedMessage id="account.login.label.signup" defaultMessage="Sign up" />
            </Button>
          </div>
        </div>
      </Center>
    </form>
  )
}

export default LoginFormSignin
