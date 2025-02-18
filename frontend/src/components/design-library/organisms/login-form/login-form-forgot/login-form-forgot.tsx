import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core'
import purple from '@material-ui/core/colors/purple'
import ReCAPTCHA from 'react-google-recaptcha'

type LoginFormForgotProps = {
  action?: string
  onClose?: () => void
  onSignin?: () => void
  noCancelButton?: boolean
}

const useStyles = makeStyles((theme) => ({
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500]
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500]
    },
  },
  notchedOutline: {},
  margins: {
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    marginRight: 20,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const LoginFormForgot = ({ action, noCancelButton, onClose, onSignin }:LoginFormForgotProps) => {
  const classes = useStyles()
  const [state, setState] = useState({
    username: '',
    password: '',
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
    // handle blur logic here
  }

  const handleType = (type) => {
    // handle type change logic here
  }

  const submitByFormType = (event) => {
    event.preventDefault()
    // handle form submission logic here
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
          justifyContent: 'center',
        }}>
          <Typography variant='body1' component='span'>
            {error.captcha}
          </Typography>
        </div>
      }
      <div className={classes.center} style={{ marginTop: 20 }}>
        <div>
          {noCancelButton ? null : (
            <Button onClick={onClose} size='large' variant='text' color='primary' className={classes.button}>
              <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
            </Button>
          )}

          <Button type='submit' size='large' variant='contained' color='primary' className={classes.button}>
            <FormattedMessage id='account.login.label.password.recover' defaultMessage='Recover password' />
          </Button>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline' }}>
            <Typography variant='body1' component='span'>
              <FormattedMessage id='account.login.label.or.signup' defaultMessage='Have an account?' />
            </Typography>
            <Button onClick={onSignin} variant='text' size='large' color='primary'>
              <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default LoginFormForgot