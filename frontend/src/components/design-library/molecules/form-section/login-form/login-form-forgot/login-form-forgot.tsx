import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  TextField,
  Typography
} from '@mui/material'
import { purple } from '@mui/material/colors'
import ReCAPTCHA from 'react-google-recaptcha'

const useStyles = makeStyles((theme) => ({
  cssLabel: {
    '&$cssFocused': {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500]
    }
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500]
    }
  },
  notchedOutline: {},
  margins: {
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    marginRight: 20
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

type LoginFormForgotProps = {
  action?: string
  onClose?: () => void
  onSignin?: () => void
  noCancelButton?: boolean,
  onSubmit?: (data:any) => any
}

const LoginFormForgot = ({ action, noCancelButton, onClose, onSignin, onSubmit }:LoginFormForgotProps) => {
  const classes = useStyles()
  const [state, setState] = useState({
    username: '',
    captchaChecked: false,
    error: {
      username: '',
      captcha: ''
    }
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
          username: 'Email cannot be empty'
        }
      })
      return false
    } else if(email.length > 72) {
      setState({
        ...state,
        error: {
          ...state.error,
          username: 'Email cannot be longer than 72 characters'
        }
      })
      return false
    }
    else {
      if (email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        setState({
          ...state,
          error: {
            ...state.error,
            username: 'Invalid email'
          }
        })
        return false
      }
    }
    return true
  }

  const submitForm = async (event) => {
    const { captchaChecked, error, username } = state;
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
          email: username
        })
        if(forgotSubmit) {
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
      <div className={classes.margins}>
        <TextField
          name="username"
          onChange={handleChange('username')}
          onBlur={handleBlur}
          fullWidth
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused
            }
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline
            }
          }}
          label="E-mail"
          variant="outlined"
          id="username"
          error={!!error.username}
          helperText={error.username}
          defaultValue={state.username}
        />
      </div>

      {process.env.NODE_ENV === 'production' && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: 80, marginTop: 20 }}>
          <ReCAPTCHA
            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
            onChange={(captchaChecked) => setState({ ...state, captchaChecked })}
          />
        </div>
      )}
      {error.captcha &&
        <div style={{
          color: 'red',
          fontSize: 10,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Typography variant="body1" component="span">
            {error.captcha}
          </Typography>
        </div>
      }
      <div className={classes.center} style={{ marginTop: 20 }}>
        <div>
          {noCancelButton ? null : (
            <Button onClick={onClose} size="large" variant="text" color="primary" className={classes.button}>
              <FormattedMessage id="account.login.label.cancel" defaultMessage="Cancel" />
            </Button>
          )}

          <Button type="submit" size="large" variant="contained" color="primary" className={classes.button}>
            <FormattedMessage id="account.login.label.password.recover" defaultMessage="Recover password" />
          </Button>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body1" component="span">
              <FormattedMessage id="account.login.label.or.signup" defaultMessage="Have an account?" />
            </Typography>
            <Button onClick={onSignin} variant="text" size="large" color="primary">
              <FormattedMessage id="account.login.label.signin" defaultMessage="Sign in" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default LoginFormForgot