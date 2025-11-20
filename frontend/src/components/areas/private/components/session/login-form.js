import React, { Component } from 'react'
import withRouter from 'react-router-dom/withRouter'
import { FormattedMessage } from 'react-intl'

import { Button, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { purple } from '@mui/material/colors'
import ReCAPTCHA from 'react-google-recaptcha'

import api from '../../../../../consts'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'

import ProviderLoginButtons from './provider-login-buttons'
import TermsOfService from './terms-of-service'
import PrivacyPolicy from './privacy-policy'

const FormRow = styled('div')(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10
}))

const Center = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formType: 'signup',
      action: `${api.API_URL}/authorize/local`,
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      validating: false,
      error: {},
      captchaChecked: false,
      rememberMe: false,
      termsOfServiceOpen: false,
      privacyPolicyOpen: false,
      agreeTermsCheck: false,
      agreeTermsCheckError: false
    }
  }

  handleType = (formType) => {
    if (formType === 'signin') {
      this.setState({ formType, action: `${api.API_URL}/authorize/local` })
    }

    if (formType === 'signup') {
      this.setState({ formType, action: `${api.API_URL}/auth/register` })
    }

    if (formType === 'forgot') {
      this.setState({ formType, action: `${api.API_URL}/auth/forgot-password` })
    }

    if (formType === 'reset') {
      this.setState({ formType, action: `${api.API_URL}/auth/reset-password` })
    }

    return false
  }

  componentDidMount() {
    const modeByPath = this.props.location?.pathname.split('/')[1]
    this.handleType(this.props.mode || modeByPath)
    process.env.NODE_ENV === 'development' && this.setState({ captchaChecked: true })
    process.env.NODE_ENV === 'test' && this.setState({ captchaChecked: true })
  }

  componentWillUnmount() {
    this.setState({ error: {} })
  }

  handleBlur = (event) => {
    this.setState({ validating: true, error: {} })
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  containUrl = (string) => {
    // Regular expression to match a basic URL structure
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi

    // Test if the string matches the URL pattern
    return urlPattern.test(string)
  }

  validateName = (name, currentErrors) => {
    if (name.length > 0 && name.length < 3) {
      this.setState({
        error: {
          ...currentErrors,
          name: 'Name cannot be too short'
        }
      })
      return false
    } else if (name.length > 72) {
      this.setState({
        error: {
          ...currentErrors,
          name: 'Name cannot be longer than 72 characters'
        }
      })
      return false
    } else if (this.containUrl(name)) {
      this.setState({
        error: {
          ...currentErrors,
          name: 'Name should not include URL'
        }
      })
      return false
    } else {
      return true
    }
  }

  validateEmail = (email, currentErrors) => {
    if (email.length < 3) {
      this.setState({
        error: {
          ...currentErrors,
          username: 'Email cannot be empty'
        }
      })
      return false
    } else if (email.length > 72) {
      this.setState({
        error: {
          ...currentErrors,
          username: 'Email cannot be longer than 72 characters'
        }
      })
      return false
    } else {
      if (
        email &&
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        this.setState({
          error: {
            ...currentErrors,
            username: 'Invalid email'
          }
        })
        return false
      }
    }
    return true
  }

  validatePassword = (password, currentErrors) => {
    if (password.length < 3) {
      this.setState({
        error: {
          ...currentErrors,
          password: 'Password cannot be empty or too short'
        }
      })
      return false
    } else if (password.length > 72) {
      this.setState({
        error: {
          ...currentErrors,
          password: 'Password cannot be longer than 72 characters'
        }
      })
      return false
    } else {
      return true
    }
  }

  validatePasswordDontMatch = (password, confirmPassword, currentErrors) => {
    const { formType } = this.state
    if (formType === 'signup' && password !== confirmPassword) {
      this.setState({
        error: {
          ...currentErrors,
          password: 'Password dont match'
        }
      })
      return false
    }
    return true
  }

  handleSubmit = (event) => {
    if (!this.state.agreeTermsCheck) this.setState({ agreeTermsCheckError: true })
    const {
      name,
      username,
      password,
      captchaChecked,
      confirmPassword,
      agreeTermsCheck,
      formType,
      error
    } = this.state
    const currentErrors = error
    if (!captchaChecked) {
      this.setState({ error: { ...currentErrors, captcha: 'Please check the captcha' } })
      event && event.preventDefault()
      return false
    }
    if (formType === 'signup') {
      event && event.preventDefault()
      const validName = this.validateName(name, currentErrors)
      const validPassword = this.validatePassword(password, currentErrors)
      const validPasswordConfirm = this.validatePasswordDontMatch(
        password,
        confirmPassword,
        currentErrors
      )
      const validEmail = this.validateEmail(username, currentErrors)
      validPassword &&
        validPasswordConfirm &&
        validEmail &&
        agreeTermsCheck &&
        validName &&
        this.props
          .registerUser({
            name,
            email: username,
            password: password
          })
          .then((response) => {
            const errorType = response.error && response.error.response.data.message
            if (errorType === 'user.exist') {
              window.location.reload('/#/signin')
            } else {
              console.log('register user')
              this.props.history.push('/signin')
              this.handleType('signin')
              return false
            }
          })
          .catch((error) => {
            this.setState({
              error: {
                ...currentErrors,
                general: 'We couldnt register this user'
              }
            })
            /* eslint-disable no-console */
            console.log(error)
          })
    } else {
      this.validateEmail(username, currentErrors)
      this.validatePassword(password, currentErrors)
    }
  }

  handleForgotSubmit = async (event) => {
    const { captchaChecked, error, username } = this.state
    event.preventDefault()
    if (!captchaChecked) {
      this.setState({ error: { ...error, captcha: 'Please check the captcha' } })
      return false
    }
    try {
      await this.props.forgotPassword({ email: username })
      this.props.history.push('/signin')
    } catch (error) {
      console.log(error)
    }
  }

  handleResetSubmit = async (event) => {
    const { password, confirmPassword, error, captchaChecked } = this.state
    event.preventDefault()
    if (!captchaChecked) {
      this.setState({ error: { ...error, captcha: 'Please check the captcha' } })
      return false
    }
    const validPasswordConfirm = this.validatePasswordDontMatch(password, confirmPassword, error)
    try {
      validPasswordConfirm &&
        (await this.props.resetPassword({ password, token: this.props.match.params.token })) &&
        this.props.history.push('/signin')
    } catch (error) {
      console.log(error)
    }
  }

  handleRememberMe = (e) => {
    this.setState({ rememberMe: !this.state.rememberMe })
  }

  handleAgreeTerms = (e) => {
    e.preventDefault()
    this.setState({ agreeTermsCheck: !this.state.agreeTermsCheck })
  }

  handleOpenTermsOfService = (e) => {
    e.preventDefault()
    this.setState({ termsOfServiceOpen: true })
  }

  handleOpenPrivacyPolicy = (e) => {
    e.preventDefault()
    this.setState({ privacyPolicyOpen: true })
  }

  submitByFormType = (e) => {
    //e.preventDefault()
    const { formType } = this.state
    switch (formType) {
      case 'signin':
        this.handleSubmit(e)
        break
      case 'signup':
        this.handleSubmit(e)
        break
      case 'forgot':
        this.handleForgotSubmit(e)
        break
      case 'reset':
        this.handleResetSubmit(e)
        break
      default:
        this.handleSubmit(e)
        break
    }
  }

  render() {
    const { onClose, noCancelButton } = this.props
    const { action, formType, termsOfServiceOpen, privacyPolicyOpen, agreeTermsCheckError } =
      this.state
    const { validating, password, confirmPassword, error } = this.state

    if (termsOfServiceOpen) {
      return (
        <div style={{ height: 'calc(100vh - 20px)', width: 500 }}>
          <TermsOfService
            onArrowBack={(e) => {
              e.preventDefault()
              this.setState({ termsOfServiceOpen: false })
            }}
            onAgreeTerms={(e) => {
              e.preventDefault()
              this.setState({ termsOfServiceOpen: false, agreeTermsCheck: true })
            }}
          />
        </div>
      )
    }

    if (privacyPolicyOpen) {
      return (
        <div style={{ height: 'calc(100vh - 20px)', width: 500 }}>
          <PrivacyPolicy
            onArrowBack={(e) => {
              e.preventDefault()
              this.setState({ privacyPolicyOpen: false })
            }}
            onAgreeTerms={(e) => {
              e.preventDefault()
              this.setState({ privacyPolicyOpen: false, agreeTermsCheck: true })
            }}
          />
        </div>
      )
    }

    return (
      <form onSubmit={this.submitByFormType} action={action} method="POST" autoComplete="off">
        {formType === 'signup' && (
          <FormRow>
            <TextField
              name="name"
              onChange={this.handleChange('name')}
              fullWidth
              sx={{
                '& .MuiInputLabel-root.Mui-focused': { color: purple[500] },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: purple[500]
                },
                '& .MuiInputBase-root.Mui-focused': { color: 'inherit' }
              }}
              label="Name"
              variant="outlined"
              id="name"
              error={error.name}
              helperText={error.name}
              defaultValue={this.state.name}
            />
          </FormRow>
        )}
        {formType !== 'reset' && (
          <FormRow>
            <TextField
              name="username"
              onChange={this.handleChange('username')}
              onBlur={this.handleBlur}
              fullWidth
              sx={{
                '& .MuiInputLabel-root.Mui-focused': { color: purple[500] },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: purple[500]
                }
              }}
              label="E-mail"
              variant="outlined"
              id="username"
              error={error.username}
              helperText={error.username}
              defaultValue={this.state.username}
            />
          </FormRow>
        )}
        {formType !== 'forgot' && (
          <FormRow>
            <TextField
              name="password"
              onChange={this.handleChange('password')}
              onBlur={this.handleBlur}
              fullWidth
              sx={{
                '& .MuiInputLabel-root.Mui-focused': { color: purple[500] },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: purple[500]
                }
              }}
              type="password"
              label="Password"
              variant="outlined"
              id="password"
              error={error.password}
              helperText={error.password}
              defaultValue={this.state.password}
            />
          </FormRow>
        )}
        {(formType === 'signup' || formType === 'reset') && (
          <FormRow>
            <TextField
              error={validating && password !== confirmPassword}
              helperText={
                validating && password !== confirmPassword ? (
                  <FormattedMessage
                    id="user.confirm.password.error"
                    defaultMessage="Passwords do not match"
                  />
                ) : (
                  ''
                )
              }
              name="confirm_password"
              onChange={this.handleChange('confirmPassword')}
              onBlur={this.handleBlur}
              fullWidth
              sx={{
                '& .MuiInputLabel-root.Mui-focused': { color: purple[500] },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: purple[500]
                }
              }}
              type="password"
              label="Confirm Password"
              variant="outlined"
              id="confirmPassword"
              defaultValue={this.state.confirmPassword}
            />
          </FormRow>
        )}

        {formType === 'signin' && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {this.state.rememberMe ? (
                <CheckBox checked={this.state.rememberMe} onClick={this.handleRememberMe} />
              ) : (
                <CheckBoxOutlineBlank
                  checked={this.state.rememberMe}
                  onClick={this.handleRememberMe}
                />
              )}
              <Typography variant="caption" style={{ marginLeft: 10 }}>
                <FormattedMessage id="account.login.label.remember" defaultMessage="Remember me" />
              </Typography>
            </div>
            <Button
              variant="text"
              style={{ margin: 0, padding: 0 }}
              onClick={() => this.handleType('forgot')}
              component="a"
              size="small"
              color="primary"
            >
              <FormattedMessage
                variant="caption"
                id="account.login.label.forgot"
                defaultMessage="Forgot password?"
              />
            </Button>
          </div>
        )}
        {formType === 'signup' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.state.agreeTermsCheck ? (
                  <CheckBox
                    checked={this.state.rememberMe}
                    onClick={this.handleAgreeTerms}
                    data-testid="agree-terms-checkbox-checked"
                  />
                ) : (
                  <CheckBoxOutlineBlank
                    checked={this.state.rememberMe}
                    onClick={this.handleAgreeTerms}
                    data-testid="agree-terms-checkbox"
                  />
                )}
                <Typography variant="body1" style={{ marginLeft: 10 }}>
                  <FormattedMessage
                    id="account.login.label.terms.agree"
                    defaultMessage="I agree with the "
                  />
                  <a
                    onClick={this.handleOpenTermsOfService}
                    href="/#/terms"
                    target="_blank"
                    style={{ display: 'inline-block', marginRight: 5, marginLeft: 5 }}
                  >
                    <FormattedMessage
                      id="account.login.label.terms"
                      defaultMessage="Terms of Service"
                    />
                  </a>
                  <FormattedMessage id="account.login.label.terms.and" defaultMessage=" and" />
                  <a
                    href="/#/privacy-policy"
                    onClick={this.handleOpenPrivacyPolicy}
                    target="_blank"
                    style={{ display: 'inline-block', marginLeft: 5 }}
                  >
                    <FormattedMessage
                      id="account.login.label.privacy"
                      defaultMessage="Privacy Policy"
                    />
                  </a>
                </Typography>
              </div>
            </div>
            {agreeTermsCheckError && (
              <div
                style={{
                  color: 'red',
                  fontSize: 10,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Typography type="body1" component="span">
                  <FormattedMessage
                    id="account.login.label.terms.agree.error"
                    defaultMessage="You must agree with the Terms of Service and Privacy Policy"
                  />
                </Typography>
              </div>
            )}
          </>
        )}
        {process.env.NODE_ENV === 'production' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: 80,
              marginTop: 20
            }}
          >
            <ReCAPTCHA
              sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
              onChange={(captchaChecked) => this.setState({ captchaChecked })}
            />
          </div>
        )}
        {error.captcha && (
          <div
            style={{
              color: 'red',
              fontSize: 10,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Typography type="body1" component="span">
              {error.captcha}
            </Typography>
          </div>
        )}
        <Center style={{ marginTop: 20 }}>
          {formType === 'signin' ? (
            <div>
              <Button
                fullWidth
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                <FormattedMessage id="account.login.label.signin" defaultMessage="Sign in" />
              </Button>
              {noCancelButton ? null : (
                <Button
                  onClick={onClose}
                  fullWidth
                  size="large"
                  variant="text"
                  color="primary"
                  sx={{ mr: 2, mt: 1 }}
                >
                  <FormattedMessage id="account.login.label.cancel" defaultMessage="Cancel" />
                </Button>
              )}
              {formType === 'signin' && (
                <div style={{ marginTop: 10 }}>
                  <ProviderLoginButtons />
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <Typography
                  type="body1"
                  component="span"
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                >
                  <FormattedMessage
                    id="account.login.label.or.signing"
                    defaultMessage="Dont have an account?"
                  />
                </Typography>
                <Button
                  onClick={() => this.handleType('signup')}
                  variant="text"
                  color="primary"
                  size="large"
                >
                  <FormattedMessage id="account.login.label.signup" defaultMessage="Sign up" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {noCancelButton ? null : (
                <Button
                  onClick={onClose}
                  size="large"
                  variant="text"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <FormattedMessage id="account.login.label.cancel" defaultMessage="Cancel" />
                </Button>
              )}
              {formType === 'signup' && (
                <Button
                  data-testid="signup-button"
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <FormattedMessage id="account.login.label.signup" defaultMessage="Sign up" />
                </Button>
              )}
              {formType === 'forgot' && (
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <FormattedMessage
                    id="account.login.label.password.recover"
                    defaultMessage="Recover password"
                  />
                </Button>
              )}
              {formType === 'reset' && (
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <FormattedMessage
                    id="account.login.label.password.reset"
                    defaultMessage="Reset password"
                  />
                </Button>
              )}
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline' }}>
                <Typography type="body1" component="span">
                  <FormattedMessage
                    id="account.login.label.or.signup"
                    defaultMessage="Have an account?"
                  />
                </Typography>
                <Button
                  onClick={() => this.handleType('signin')}
                  variant="text"
                  size="large"
                  color="primary"
                >
                  <FormattedMessage id="account.login.label.signin" defaultMessage="Sign in" />
                </Button>
              </div>
            </div>
          )}
        </Center>
      </form>
    )
  }
}

export default withRouter(LoginForm)
