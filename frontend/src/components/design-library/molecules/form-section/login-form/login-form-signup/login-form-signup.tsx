import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Typography
} from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha'
import Checkbox from '@mui/material/Checkbox'
import TermsDialog from '../../../dialogs/terms-dialog/terms-dialog'
import PrivacyDialog from '../../../dialogs/privacy-dialog/privacy-dialog'
import UserRoleField from '../../../../atoms/inputs/fields/user-role-field/user-role-field'
import { Center, SpacedButton, Margins, StyledTextField } from './login-form-signup.styles'

const containUrl = (string) => {
  // Regular expression to match a basic URL structure
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // Test if the string matches the URL pattern
  return urlPattern.test(string);
}

// styles migrated to styled-components

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
  fetchRoles
}: LoginFormSignupProps) => {

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

  const handleTypesChange = useCallback((checked) => {
    setState(prev => ({ ...prev, Types: checked }))
  }, [])

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
    const { captchaChecked, agreeTermsCheck, name, username, password, confirmPassword, Types } = state
    const termsAgreed = termsChecked(agreeTermsCheck)
    const validName = validateName(name)
    const validEmail = validateEmail(username)
    const validPassword = validatePassword(password)
    const validPasswordDontMatch = validatePasswordDontMatch(password, confirmPassword)
    const validCaptcha = captchaChecked

    if (!validCaptcha) {
      setState({ ...state, error: { ...state.error, captcha: 'Please check the captcha' } })
      return false
    }

    if (termsAgreed && validName && validEmail && validPassword && validPasswordDontMatch) {
      try {
        const response = await onSubmit({
          name: name,
          email: username,
          password: password,
          Types: Types
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
    <>
      <form onSubmit={handleForm} action={action} method="POST" autoComplete="off">
        <Margins>
          <StyledTextField
            name="name"
            onChange={handleChange('name')}
            fullWidth
            label="Name"
            variant="outlined"
            id="name"
            error={!!error.name}
            helperText={error.name}
            defaultValue={state.name}
          />
        </Margins>
        <Margins>
          <StyledTextField
            name="username"
            onChange={handleChange('username')}
            onBlur={handleBlur}
            onFocus={handleFocus}
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
            onFocus={handleFocus}
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

        <Margins>
          <StyledTextField
            error={validating && password !== confirmPassword}
            helperText={validating && password !== confirmPassword ? <FormattedMessage id="user.confirm.password.error" defaultMessage="Passwords do not match" /> : ''}
            name="confirm_password"
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur}
            onFocus={handleFocus}
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            id="confirmPassword"
            defaultValue={state.confirmPassword}
          />
        </Margins>
        <Margins>
          <UserRoleField
            roles={roles}
            onChange={handleTypesChange}
          />
        </Margins>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {state.agreeTermsCheck
              ? <Checkbox checked={state.agreeTermsCheck} onClick={handleAgreeTerms} data-testid="agree-terms-checkbox-checked" />
              : <Checkbox checked={state.agreeTermsCheck} onClick={handleAgreeTerms} data-testid="agree-terms-checkbox" />
            }
            <Typography variant="body1">
              <FormattedMessage id="account.login.label.terms.agree" defaultMessage="I agree with the " />
              <a href='/#/terms' onClick={handleOpenTermsOfService} target="_blank" style={{ display: 'inline-block', marginRight: 5, marginLeft: 5 }}>
                <FormattedMessage id="account.login.label.terms" defaultMessage="Terms of Service" />
              </a>
              <FormattedMessage id="account.login.label.terms.and" defaultMessage=" and" />
              <a href="/#/privacy-policy" onClick={handleOpenPrivacyPolicy} target="_blank" style={{ display: 'inline-block', marginLeft: 5 }}>
                <FormattedMessage id="account.login.label.privacy" defaultMessage="Privacy Policy" />
              </a>
            </Typography>
          </div>
        </div>
        {agreeTermsCheckError &&
          <div style={{
            color: 'red',
            fontSize: 10,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Typography variant="body1" component="span">
              <FormattedMessage id="account.login.label.terms.agree.error" defaultMessage="You must agree with the Terms of Service and Privacy Policy" />
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
            justifyContent: 'center'
          }}>
            <Typography variant="body1" component="span">
              {error.captcha}
            </Typography>
          </div>
        }
        <Center style={{ marginTop: 20 }}>
          <div>
            {noCancelButton ? null : (
              <SpacedButton onClick={onClose} size="large" variant="text" color="primary">
                <FormattedMessage id="account.login.label.cancel" defaultMessage="Cancel" />
              </SpacedButton>
            )}
            <SpacedButton data-testid="signup-button" type="submit" size="large" variant="contained" color="primary">
              <FormattedMessage id="account.login.label.signup" defaultMessage="Sign up" />
            </SpacedButton>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="body1" component="span">
                <FormattedMessage id="account.login.label.or.signup" defaultMessage="Have an account?" />
              </Typography>
              <Button onClick={onSignin} variant="text" size="large" color="primary">
                <FormattedMessage id="account.login.label.signin" defaultMessage="Sign in" />
              </Button>
            </div>
          </div>
        </Center>
      </form>
      <TermsDialog open={openTermsDialog} onClose={closeTermsDialog} />
      <PrivacyDialog open={openPrivacyDialog} onClose={closePrivacyDialog} />
    </>
  )
}

export default LoginFormSignup