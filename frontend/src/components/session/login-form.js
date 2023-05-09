import React, { Component } from 'react'
import withRouter from 'react-router-dom/withRouter'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  withStyles,
  TextField,
  Typography
} from '@material-ui/core'
import purple from '@material-ui/core/colors/purple'
import ReCAPTCHA from 'react-google-recaptcha'

import api from '../../consts'
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons'

import ProviderLoginButtons from './provider-login-buttons'
import TermsOfService from './terms-of-service'
import PrivacyPolicy from './privacy-policy'

const styles = theme => ({
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
})

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formType: 'signup',
      action: `${api.API_URL}/authorize/local`,
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

  componentDidMount () {
    const modeByPath = this.props.location.pathname.split('/')[1]
    this.handleType(this.props.mode || modeByPath)
    process.env.NODE_ENV === 'development' && this.setState({ captchaChecked: true })
  }

  handleBlur = (event) => {
    this.setState({ validating: true, error: {} })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleType = formType => {
    if (formType === 'signin') {
      this.setState({ formType, action: `${api.API_URL}/authorize/local` })
    }

    if (formType === 'signup') {
      this.setState({ formType, action: `${api.API_URL}/auth/register` })
    }

    if(formType === 'forgot') {
      this.setState({ formType, action: `${api.API_URL}/auth/forgot-password` })
    }

    if(formType === 'reset') {
      this.setState({ formType, action: `${api.API_URL}/auth/reset-password` })
    }

    return false
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
    }
    else {
      if (email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
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
    }
    return true
  }

  validatePasswordDontMatch = (password, confirmPassword, currentErrors) => {
    const { formType } = this.state
    if ( formType === 'signup' && password !== confirmPassword) {
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

  handleSubmit = event => {
    const { name, username, password, captchaChecked, confirmPassword, agreeTermsCheck, formType, error } = this.state
    const currentErrors = error
    if (!captchaChecked) {
      this.setState({ error: { ...currentErrors, captcha: 'Please check the captcha' } })
      event && event.preventDefault()
      return false
    }
    if (formType === 'signup') {
      event && event.preventDefault()
      const validPassword = this.validatePassword(password, currentErrors)
      const validPasswordConfirm = this.validatePasswordDontMatch(password, confirmPassword, currentErrors)
      const validEmail = this.validateEmail(username, currentErrors)
      if(!agreeTermsCheck) this.setState({ agreeTermsCheckError: true })
      validPassword && validPasswordConfirm && validEmail && agreeTermsCheck &&
      this.props.registerUser({
        name,
        email: username,
        password: password
      }).then((response) => {
        const errorType = response.error && response.error.response.data.message
        if (errorType === 'user.exist') {
          window.location.reload('/#/signin')
        }
        else {
          this.props.history.push('/signin')
          return false
        }
      }).catch((error) => {
        this.setState({
          error: {
            ...currentErrors,
            'general': 'We couldnt register this user'
          }
        })
        /* eslint-disable no-console */
        console.log(error)
      })
    }
    else {
      this.validateEmail(username, currentErrors)
      this.validatePassword(password, currentErrors)
    }
  }

  handleForgotSubmit = async event => {
    const { captchaChecked, error, username } = this.state;
    event.preventDefault();
    if (!captchaChecked) {
      this.setState({ error: { ...error, captcha: 'Please check the captcha' } })
      return false
    }
    try {
      await this.props.forgotPassword({email: username})
      this.props.history.push('/signin')
    } catch (error) {
      console.log(error)
    }
  }

  handleResetSubmit = async event => {
    const { password, confirmPassword, error, captchaChecked } = this.state
    event.preventDefault();
    if (!captchaChecked) {
      this.setState({ error: { ...error, captcha: 'Please check the captcha' } })
      return false
    }
    const validPasswordConfirm = this.validatePasswordDontMatch(password, confirmPassword, error)
    try {
      validPasswordConfirm 
        && await this.props.resetPassword({password, token: this.props.match.params.token})
        && this.props.history.push('/signin')
    } catch (error) {
      console.log(error)
    }
  }

  handleRememberMe = (e) => {
    this.setState({ rememberMe: !this.state.rememberMe })
  }

  handleAgreeTerms = (e) => {
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
    switch(formType) {
      case 'signin':
        this.handleSubmit(e)
        break;
      case 'signup':
        this.handleSubmit(e)
        break;
      case 'forgot':
        this.handleForgotSubmit(e)
        break;
      case 'reset':
        this.handleResetSubmit(e)
        break;
      default:
        this.handleSubmit(e)
        break;
    }
  }

  render () {
    const { classes, onClose, noCancelButton } = this.props
    const { action, formType, termsOfServiceOpen, privacyPolicyOpen, agreeTermsCheckError } = this.state
    const { validating, password, confirmPassword, error } = this.state

    if(termsOfServiceOpen) { 
      return (
        <div style={{height: 'calc(100vh - 20px)', width: 500}}>
          <TermsOfService 
            onArrowBack={
              (e) => {
                e.preventDefault()
                this.setState({termsOfServiceOpen: false})
              }
            }
            onAgreeTerms={
              (e) => {
                e.preventDefault()
                this.setState({termsOfServiceOpen: false, agreeTermsCheck: true})
              }
            }
          />
        </div>
      )
    }

    if(privacyPolicyOpen) { 
      return (
        <div style={{height: 'calc(100vh - 20px)', width: 500}}>
          <PrivacyPolicy 
            onArrowBack={
              (e) => {
                e.preventDefault()
                this.setState({privacyPolicyOpen: false})
              }
            }
            onAgreeTerms={
              (e) => {
                e.preventDefault()
                this.setState({privacyPolicyOpen: false, agreeTermsCheck: true})
              }
            }
          />
        </div>
      )
    }

    return (
      <form onSubmit={ this.submitByFormType } action={ action } method='POST' autoComplete='off'>
        { formType === 'signup' && (
          <div className={ classes.margins }>
            <TextField
              name='name'
              onChange={ this.handleChange('name') }
              fullWidth
              InputLabelProps={ {
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              } }
              InputProps={ {
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              } }
              label='Name'
              variant='outlined'
              id='name'
              defaultValue={ this.state.name }
            />
          </div>
        ) }
        { formType !== 'reset' && (
          <div className={ classes.margins }>
            <TextField
              name='username'
              onChange={ this.handleChange('username') }
              onBlur={ this.handleBlur }
              fullWidth
              InputLabelProps={ {
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              } }
              InputProps={ {
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              } }
              label='E-mail'
              variant='outlined'
              id='username'
              error={ error.username }
              helperText={ error.username }
              defaultValue={ this.state.username }
            />
          </div>
        ) }
        { formType !== 'forgot' && (
        <div className={ classes.margins }>
          <TextField
            name='password'
            onChange={ this.handleChange('password') }
            onBlur={ this.handleBlur }
            fullWidth
            InputLabelProps={ {
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            } }
            InputProps={ {
              classes: {
                root: classes.cssOutlinedInput,
                focused: classes.cssFocused,
                notchedOutline: classes.notchedOutline,
              },
            } }
            type='password'
            label='Password'
            variant='outlined'
            id='password'
            error={ error.password }
            helperText={ error.password }
            defaultValue={ this.state.password }
          />
        </div>) }
        { (formType === 'signup' || formType === 'reset') && (
          <div className={ classes.margins }>
            <TextField
              error={ validating && password !== confirmPassword }
              helperText={ validating && password !== confirmPassword ? <FormattedMessage id='user.confirm.password.error' defaultMessage='Passwords do not match' /> : '' }
              name='confirm_password'
              onChange={ this.handleChange('confirmPassword') }
              onBlur={ this.handleBlur }
              fullWidth
              InputLabelProps={ {
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              } }
              InputProps={ {
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              } }
              type='password'
              label='Confirm Password'
              variant='outlined'
              id='confirmPassword'
              defaultValue={ this.state.confirmPassword }
            />
          </div>
        ) }
        
        { formType === 'signin' && (
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <div style={ { display: 'flex', alignItems: 'center' } }>
              { this.state.rememberMe
                ? <CheckBox checked={ this.state.rememberMe } onClick={ this.handleRememberMe } />
                : <CheckBoxOutlineBlank checked={ this.state.rememberMe } onClick={ this.handleRememberMe } />
              }
              <Typography variant='caption' style={ { marginLeft: 10 } }>
                <FormattedMessage id='account.login.label.remember' defaultMessage='Remember me' />
              </Typography>
            </div>
            <Button variant='text' style={ { margin: 0, padding: 0 } } onClick={ () => this.handleType('forgot') } component='a' size='small' color='primary'>
              <FormattedMessage variant='caption' id='account.login.label.forgot' defaultMessage='Forgot password?' />
            </Button>
          </div>
        ) }
        { formType === 'signup' && (
          <>
          <div style={ { display: 'flex', justifyContent: 'flex-start' } }>
            <div style={ { display: 'flex', alignItems: 'center' } }>
              { this.state.agreeTermsCheck
                ? <CheckBox checked={ this.state.rememberMe } onClick={ this.handleAgreeTerms } />
                : <CheckBoxOutlineBlank checked={ this.state.rememberMe } onClick={ this.handleAgreeTerms } />
              }
              <Typography variant='body1' style={ { marginLeft: 10 } }>
                <FormattedMessage id='account.login.label.terms.agree' defaultMessage='I agree with the' />
                <a onClick={this.handleOpenTermsOfService} href='/#/terms' target='_blank' style={ { marginLeft: 5 } }>
                  <FormattedMessage id='account.login.label.terms' defaultMessage='Terms of Service' />
                </a> 
                 <FormattedMessage id='account.login.label.terms.and' defaultMessage=' and' /> 
                <a href='/#/privacy-policy' onClick={this.handleOpenPrivacyPolicy} target='_blank' style={ { marginLeft: 5 } }>
                  <FormattedMessage id='account.login.label.privacy' defaultMessage='Privacy Policy' />
                </a>
              </Typography>
            </div>
          </div>
           { agreeTermsCheckError &&
            <div style={ {
              color: 'red',
              fontSize: 10,
              display: 'flex',
              justifyContent: 'center',
            } }>
              <Typography type='body1' component='span'>
                <FormattedMessage id='account.login.label.terms.agree.error' defaultMessage='You must agree with the Terms of Service and Privacy Policy' />
              </Typography>
            </div>
          }
          
          </>
        ) }
        { process.env.NODE_ENV === 'production' && (
          <div style={ { display: 'flex', justifyContent: 'center', width: '100%', height: 80, marginTop: 20 } }>
            <ReCAPTCHA
              sitekey={ process.env.GOOGLE_RECAPTCHA_SITE_KEY }
              onChange={ captchaChecked => this.setState({ captchaChecked }) }
            />
          </div>
        ) }
        { error.captcha &&
          <div style={ {
            color: 'red',
            fontSize: 10,
            display: 'flex',
            justifyContent: 'center',
          } }>
            <Typography type='body1' component='span'>
              { error.captcha }
            </Typography>
          </div>
        }
        <div className={ classes.center } style={ { marginTop: 20 } }>

          { formType === 'signin' ? (
            <div>
              <Button fullWidth type='submit' size='large' variant='contained' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
              </Button>
              { noCancelButton ? null : (
                <Button onClick={ onClose } fullWidth size='large' variant='text' color='primary' className={ classes.button } style={ { marginTop: 10 } }>
                  <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
                </Button>
              ) }
              { formType === 'signin' && (
                <div style={ { marginTop: 10 } }>
                  <ProviderLoginButtons />
                </div>
              ) }
              <div style={ { marginTop: 10 } }>
                <Typography type='body1' component='span' style={ { display: 'inline-block', verticalAlign: 'middle' } }>
                  <FormattedMessage id='account.login.label.or.signing' defaultMessage='Dont have an account?' />
                </Typography>
                <Button onClick={ () => this.handleType('signup') } variant='text' color='primary' size='large'>
                  <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              { noCancelButton ? null : (
                <Button onClick={ onClose } size='large' variant='text' color='primary' className={ classes.button }>
                  <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
                </Button>
              ) }
              { formType === 'signup' && (
                <Button type='submit' size='large' variant='contained' color='primary' className={ classes.button }>
                  <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
                </Button>
              ) }
              { formType === 'forgot' && (
                <Button type='submit' size='large' variant='contained' color='primary' className={ classes.button }>
                  <FormattedMessage id='account.login.label.password.recover' defaultMessage='Recover password' />
                </Button>
              ) }
              { formType === 'reset' && (
                <Button type='submit' size='large' variant='contained' color='primary' className={ classes.button }>
                  <FormattedMessage id='account.login.label.password.reset' defaultMessage='Reset password' />
                </Button>
              ) }
              <div style={ { marginTop: 20, display: 'flex', alignItems: 'baseline' } }>
                <Typography type='body1' component='span'>
                  <FormattedMessage id='account.login.label.or.signup' defaultMessage='Have an account?' />
                </Typography>
                <Button onClick={ () => this.handleType('signin') } variant='text' size='large' color='primary'>
                  <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
                </Button>
              </div>
            </div>
          )
          }
        </div>
      </form>
    )
  }
}

export default withRouter(withStyles(styles)(LoginForm))
