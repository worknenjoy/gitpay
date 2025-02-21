import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core'
import ReCAPTCHA from 'react-google-recaptcha'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cssLabel: {
    '&$cssFocused': {
      color: theme.palette.primary.main,
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.primary.main
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: theme.palette.primary.main
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

type LoginFormSignupProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  action?: string
  onClose?: () => void
  noCancelButton?: boolean
  validating?: boolean
  password?: string
  confirmPassword?: string
  agreeTermsCheckError?: boolean,
  onSignin?: () => void
}

const LoginFormSignup = ({
  onSubmit,
  action,
  onClose,
  noCancelButton,
  validating,
  password,
  confirmPassword,
  agreeTermsCheckError,
  onSignin
}:LoginFormSignupProps) => {
  const classes = useStyles()
  const [state, setState] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTermsCheck: false,
    captchaChecked: false,
    error: {
      username: '',
      name: '',
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

  const handleAgreeTerms = () => {
    setState({ ...state, agreeTermsCheck: !state.agreeTermsCheck })
  }

  const handleOpenTermsOfService = () => {
    // handle open terms of service logic here
  }

  const handleOpenPrivacyPolicy = () => {
    // handle open privacy policy logic here
  }

  const handleType = (type) => {
    // handle type logic here
  }

  const { error } = state

  return (
    <form onSubmit={onSubmit} action={action} method='POST' autoComplete='off'>
      <div className={classes.margins}>
        <TextField
          name='name'
          onChange={handleChange('name')}
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
          label='Name'
          variant='outlined'
          id='name'
          error={!!error.name}
          helperText={error.name}
          defaultValue={state.name}
        />
      </div>

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

      <div className={classes.margins}>
        <TextField
          error={validating && password !== confirmPassword}
          helperText={validating && password !== confirmPassword ? <FormattedMessage id='user.confirm.password.error' defaultMessage='Passwords do not match' /> : ''}
          name='confirm_password'
          onChange={handleChange('confirmPassword')}
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
          label='Confirm Password'
          variant='outlined'
          id='confirmPassword'
          defaultValue={state.confirmPassword}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {state.agreeTermsCheck
            ? <Checkbox checked={state.agreeTermsCheck} onClick={handleAgreeTerms} data-testid='agree-terms-checkbox-checked' />
            : <Checkbox checked={state.agreeTermsCheck} onClick={handleAgreeTerms} data-testid='agree-terms-checkbox' />
          }
          <Typography variant='body1' style={{ marginLeft: 10 }}>
            <FormattedMessage id='account.login.label.terms.agree' defaultMessage='I agree with the ' />
            <a onClick={handleOpenTermsOfService} href='/#/terms' target='_blank' style={{ display: 'inline-block', marginRight: 5, marginLeft: 5 }}>
              <FormattedMessage id='account.login.label.terms' defaultMessage='Terms of Service' />
            </a>
            <FormattedMessage id='account.login.label.terms.and' defaultMessage=' and' />
            <a href='/#/privacy-policy' onClick={handleOpenPrivacyPolicy} target='_blank' style={{ display: 'inline-block', marginLeft: 5 }}>
              <FormattedMessage id='account.login.label.privacy' defaultMessage='Privacy Policy' />
            </a>
          </Typography>
        </div>
      </div>
      {agreeTermsCheckError &&
        <div style={{
          color: 'red',
          fontSize: 10,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Typography variant='body1' component='span'>
            <FormattedMessage id='account.login.label.terms.agree.error' defaultMessage='You must agree with the Terms of Service and Privacy Policy' />
          </Typography>
        </div>
      }

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
          {noCancelButton ? null : (
            <Button onClick={onClose} size='large' variant='text' color='primary' className={classes.button}>
              <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
            </Button>
          )}
          <Button data-testid='signup-button' type='submit' size='large' variant='contained' color='primary' className={classes.button}>
            <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
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

export default LoginFormSignup