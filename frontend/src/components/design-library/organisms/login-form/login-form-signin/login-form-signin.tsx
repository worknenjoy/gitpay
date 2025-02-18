import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Typography,
  TextField
} from '@material-ui/core'
import ReCAPTCHA from 'react-google-recaptcha'
import Checkbox from '@material-ui/core/Checkbox'
import ProviderLoginButtons from '../../../molecules/provider-login-buttons/provider-login-buttons'
import { makeStyles } from '@material-ui/core/styles'

type LoginFormSigninProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  action?: string
  onClose?: () => void
  onSignup?: () => void
  noCancelButton?: boolean
}

const useStyles = makeStyles((theme) => ({
  margins: {
    marginBottom: 20
  },
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginTop: 10
  },
  cssLabel: {
    '&$cssFocused': {
      color: theme.palette.primary.main,
    },
  },
  cssFocused: {},
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  },
  notchedOutline: {},
}))

const LoginFormSignin = ({ onSubmit, action, onClose, onSignup, noCancelButton }:LoginFormSigninProps) => {
  const classes = useStyles()
  const [state, setState] = useState({
    username: '',
    password: '',
    rememberMe: false,
    captchaChecked: false,
    error: {
      username: '',
      password: '',
      captcha: ''
    }
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

  const handleType = (type) => {
    // handle type logic
  }

  const submitByFormType = (event) => {
    event.preventDefault()
    // handle form submission
  }

  const { error } = state

  return (
    <form onSubmit={submitByFormType} action={action} method='POST' autoComplete='off'>
      <div className={classes.margins}>
        <TextField
          name='username'
          onChange={handleChange('username')}
          onBlur={handleBlur}
          fullWidth
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
          label='E-mail'
          variant='outlined'
          id='username'
          error={!!error.username}
          helperText={error.username}
          defaultValue={state.username}
        />
      </div>

      <div className={classes.margins}>
        <TextField
          name='password'
          onChange={handleChange('password')}
          onBlur={handleBlur}
          fullWidth
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
          type='password'
          label='Password'
          variant='outlined'
          id='password'
          error={!!error.password}
          helperText={error.password}
          defaultValue={state.password}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {state.rememberMe
            ? <Checkbox checked={state.rememberMe} onClick={handleRememberMe} />
            : <Checkbox checked={state.rememberMe} onClick={handleRememberMe} />
          }
          <Typography variant='caption' style={{ marginLeft: 10 }}>
            <FormattedMessage id='account.login.label.remember' defaultMessage='Remember me' />
          </Typography>
        </div>
        <Button variant='caption' style={{ margin: 0, padding: 0 }} onClick={() => handleType('forgot')} component='a' size='small' color='primary'>
          <FormattedMessage id='account.login.label.forgot' defaultMessage='Forgot password?' />
        </Button>
      </div>

      {process.env.NODE_ENV === 'production' && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: 80, marginTop: 20 }}>
          <ReCAPTCHA
            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
            onChange={captchaChecked => setState({ ...state, captchaChecked })}
          />
        </div>
      )}
      {error.captcha &&
        <div style={{
          color: 'red',
          fontSize: 10,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Typography variant='body1' component='span'>
            {error.captcha}
          </Typography>
        </div>
      }
      <div className={classes.center} style={{ marginTop: 20 }}>
        <div>
          <Button fullWidth type='submit' size='large' variant='contained' color='primary' className={classes.button}>
            <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
          </Button>
          {noCancelButton ? null : (
            <Button onClick={onClose} fullWidth size='large' variant='text' color='primary' className={classes.button} style={{ marginTop: 10 }}>
              <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
            </Button>
          )}

          <div style={{ marginTop: 10 }}>
            <ProviderLoginButtons />
          </div>

          <div style={{ marginTop: 10 }}>
            <Typography variant='body1' component='span' style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <FormattedMessage id='account.login.label.or.signing' defaultMessage='Dont have an account?' />
            </Typography>
            <Button onClick={onSignup} variant='text' color='primary' size='large'>
              <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default LoginFormSignin