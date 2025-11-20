import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Typography } from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha'
import { Center, SpacedButton, Margins, StyledTextField } from './login-form-forgot.styles'

type LoginFormForgotProps = {
  action?: string
  onClose?: () => void
  onSignin?: () => void
  noCancelButton?: boolean
  onSubmit?: (data: any) => any
}

const LoginFormForgot = ({
  action,
  noCancelButton,
  onClose,
  onSignin,
  onSubmit,
}: LoginFormForgotProps) => {
  const [state, setState] = useState({
    username: '',
    captchaChecked: false,
    error: {
      username: '',
      captcha: '',
    },
  })

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value })
  }

  const handleBlur = () => {
    // handle blur logic here
  }

  const validEmail = (email) => {
    if (email.length < 3) {
      setState({
        ...state,
        error: {
          ...state.error,
          username: 'Email cannot be empty',
        },
      })
      return false
    } else if (email.length > 72) {
      setState({
        ...state,
        error: {
          ...state.error,
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
            ...state.error,
            username: 'Invalid email',
          },
        })
        return false
      }
    }
    return true
  }

  const submitForm = async (event) => {
    const { captchaChecked, error, username } = state
    event.preventDefault()
    const isMailValid = validEmail(username)
    if (!isMailValid) {
      setState({ ...state, error: { ...error, username: 'Invalid e-mail' } })
      return
    }
    if (!captchaChecked) {
      setState({ ...state, error: { ...error, captcha: 'Please check the captcha' } })
      return
    }
    if (onSubmit) {
      try {
        const forgotSubmit = await onSubmit({
          email: username,
        })
        if (forgotSubmit) {
          window.location.assign('/#/signin')
        }
      } catch (e) {
        console.error(e)
        setState({ ...state, error: { ...error, username: 'Error to send forgot password' } })
      }
    }
  }

  useEffect(() => {
    process.env.NODE_ENV === 'development' && setState({ ...state, captchaChecked: true })
    process.env.NODE_ENV === 'test' && setState({ ...state, captchaChecked: true })
  }, [])

  const { error } = state

  return (
    <form onSubmit={submitForm} action={action} method="POST" autoComplete="off">
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
          {noCancelButton ? null : (
            <SpacedButton onClick={onClose} size="large" variant="text" color="primary">
              <FormattedMessage id="account.login.label.cancel" defaultMessage="Cancel" />
            </SpacedButton>
          )}

          <SpacedButton type="submit" size="large" variant="contained" color="primary">
            <FormattedMessage
              id="account.login.label.password.recover"
              defaultMessage="Recover password"
            />
          </SpacedButton>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body1" component="span">
              <FormattedMessage
                id="account.login.label.or.signup"
                defaultMessage="Have an account?"
              />
            </Typography>
            <Button onClick={onSignin} variant="text" size="large" color="primary">
              <FormattedMessage id="account.login.label.signin" defaultMessage="Sign in" />
            </Button>
          </div>
        </div>
      </Center>
    </form>
  )
}

export default LoginFormForgot
