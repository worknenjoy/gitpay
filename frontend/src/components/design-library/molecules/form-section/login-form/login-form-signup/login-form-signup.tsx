import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core'
import ReCAPTCHA from 'react-google-recaptcha'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles'
import TermsDialog from '../../../dialogs/terms-dialog/terms-dialog'
import PrivacyDialog from '../../../dialogs/privacy-dialog/privacy-dialog'
import UserRoleField from '../../../../atoms/inputs/fields/user-role-field/user-role-field'

const containUrl = (string) => {
  // Regular expression to match a basic URL structure
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // Test if the string matches the URL pattern
  return urlPattern.test(string);
}

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
  onSubmit?: (data: any) => any
  action?: string
  onClose?: () => void
  noCancelButton?: boolean
  agreeTermsCheckError?: boolean,
  onSignin?: () => void,
  roles?: any
  fetchRoles?: () => void
}

const LoginFormSignup = ({
  onSubmit,
  action,
  onClose,
  noCancelButton,
  agreeTermsCheckError,
  onSignin,
  roles,
  fetchRoles,
}: LoginFormSignupProps) => {
  const classes = useStyles()
  const [openTermsDialog, setOpenTermsDialog] = useState(false)
  const [openPrivacyDialog, setOpenPrivacyDialog] = useState(false)
  const [validating, setValidating] = useState(false)
  const [state, setState] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTermsCheck: false,
    captchaChecked: false,
    Types: [],
    error: {
      username: '',
      name: '',
      password: '',
      captcha: '',
      general: ''
    }
  })

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setState({ ...state, [name]: value })
  }

  const handleTypesChange = (name) => (checked) => {
    setState({ ...state, [name]: checked })
  }

  const handleBlur = () => {
    setValidating(true)
  }

  const handleFocus = () => {
    setValidating(false)
  }

  const handleAgreeTerms = () => {
    setState({ ...state, agreeTermsCheck: !state.agreeTermsCheck })
  }

  const handleOpenTermsOfService = (e) => {
    e.preventDefault()
    setOpenTermsDialog(true)

  }

  const handleOpenPrivacyPolicy = (e) => {
    e.preventDefault()
    setOpenPrivacyDialog(true)
  }

  const closeTermsDialog = (e) => {
    e.preventDefault()
    setOpenTermsDialog(false)
  }

  const closePrivacyDialog = (e) => {
    e.preventDefault()
    setOpenPrivacyDialog(false)
  }

  const validateName = (name) => {
    if (name.length > 0 && name.length < 3) {
      setState({
        ...state,
        error: {
          ...state.error,
          name: 'Name cannot be too short'
        }
      })
      return false
    } else if (name.length > 72) {
      setState({
        ...state,
        error: {
          ...state.error,
          name: 'Name cannot be longer than 72 characters'
        }
      })
      return false
    } else if (containUrl(name)) {
      setState({
        ...state,
        error: {
          ...state.error,
          name: 'Name should not include URL'
        }
      })
      return false
    }
    else {
      return true;
    }
  }

  const validateEmail = (email) => {
    if (email.length < 3) {
      setState({
        ...state,
        error: {
          ...state.error,
          username: 'Email cannot be empty'
        }
      })
      return false
    } else if (email.length > 72) {
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

  const validatePassword = (password) => {
    if (password.length < 7) {
      setState({
        ...state,
        error: {
          ...state.error,
          password: 'Password cannot be empty or too short'
        }
      })
      return false
    } else if (password.length > 72) {
      setState({
        ...state,
        error: {
          ...state.error,
          password: 'Password cannot be longer than 72 characters'
        }
      })
      return false
    } else {
      return true;
    }
  }

  const validatePasswordDontMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setState({
        ...state,
        error: {
          ...state.error,
          password: 'Password dont match'
        }
      })
      return false
    }
    return true
  }

  const termsChecked = (agreeTermsCheck) => {
    if (!agreeTermsCheck) {
      setState({
        ...state,
        error: {
          ...state.error,
          captcha: 'You must agree with the Terms of Service and Privacy Policy'
        }
      })
    }
    return agreeTermsCheck
  }

  const handleForm = async (e) => {
    e.preventDefault()
    const termsAgreed = termsChecked(state.agreeTermsCheck)
    const validName = validateName(state.name)
    const validEmail = validateEmail(state.username)
    const validPassword = validatePassword(state.password)
    const validPasswordDontMatch = validatePasswordDontMatch(state.password, state.confirmPassword)

    if (termsAgreed && validName && validEmail && validPassword && validPasswordDontMatch && state.captchaChecked) {
      try {
        const response = await onSubmit({
          name: state.name,
          email: state.username,
          password: state.password,
          Types: state.Types,
        })
        const errorType = response?.error && response?.error?.response?.data.message
        if (errorType === 'user.exist') {
          window.location.assign('/#/signin')
        }
        else {
          window.location.assign('/#/signin')
          return false
        }
        setState({
          ...state,
          error: {
            captcha: '',
            general: '',
            name: '',
            username: '',
            password: ''
          }
        })
      } catch (error) {
        setState({
          ...state,
          error: {
            ...state.error,
            'general': 'We couldnt register this user'
          }
        })
        /* eslint-disable no-console */
        console.log(error)
      }
    }
  }

  useEffect(() => {
    process.env.NODE_ENV === 'development' && setState({ ...state, captchaChecked: true })
    process.env.NODE_ENV === 'test' && setState({ ...state, captchaChecked: true })
    fetchRoles()
  }, [])

  const { error, password, confirmPassword } = state

  return (
    <form onSubmit={handleForm} action={action} method='POST' autoComplete='off'>
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
          onFocus={handleFocus}
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
          onFocus={handleFocus}
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
          onFocus={handleFocus}
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
      <div className={classes.margins}>
        <UserRoleField
          roles={roles}
          onChange={handleTypesChange('Types')}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {state.agreeTermsCheck
            ? <Checkbox checked={state.agreeTermsCheck} onClick={handleAgreeTerms} data-testid='agree-terms-checkbox-checked' />
            : <Checkbox checked={state.agreeTermsCheck} onClick={handleAgreeTerms} data-testid='agree-terms-checkbox' />
          }
          <Typography variant='body1'>
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
      <TermsDialog open={openTermsDialog} onClose={closeTermsDialog} />
      <PrivacyDialog open={openPrivacyDialog} onClose={closePrivacyDialog} />
    </form>
  )
}

export default LoginFormSignup