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
      type: 'signup',
      action: `${api.API_URL}/authorize/local`,
      username: '',
      password: '',
      confirmPassword: '',
      validating: false,
      error: {},
      captchaChecked: false,
      rememberMe: false
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

  handleType = type => {
    if (type === 'signin') {
      this.setState({ type: type, action: `${api.API_URL}/authorize/local` })
    }

    if (type === 'signup') {
      this.setState({ type: type, action: `${api.API_URL}/auth/register` })
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
    if (password !== confirmPassword) {
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
    const currentErrors = this.state.error
    if (!this.state.captchaChecked) {
      this.setState({ error: { ...currentErrors, captcha: 'Please check the captcha' } })
      event && event.preventDefault()
      return false
    }
    const { name, username, password, confirmPassword } = this.state
    if (this.state.type === 'signup') {
      event && event.preventDefault()
      const validPassword = this.validatePassword(password, currentErrors)
      const validPasswordConfirm = this.validatePasswordDontMatch(password, confirmPassword, currentErrors)
      const validEmail = this.validateEmail(username, currentErrors)
      validPassword && validPasswordConfirm && validEmail &&
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

  handleRememberMe = (e) => {
    this.setState({ rememberMe: !this.state.rememberMe })
  }

  render () {
    const { classes, onClose, noCancelButton } = this.props
    const { action, type } = this.state
    const { validating, password, confirmPassword, error } = this.state
    return (
      <form onSubmit={ this.handleSubmit } action={ action } method='POST' autoComplete='off'>
        { type === 'signup' && (
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
            />
          </div>
        ) }
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
          />
        </div>
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
          />
        </div>
        { type === 'signup' && (
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
            />
          </div>
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
        { type === 'signin' && (
          <div style={ { display: 'flex', justifyContent: 'space-between', display: 'none' } }>
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
        <div className={ classes.center } style={ { marginTop: 20 } }>
          { type === 'signin' ? (
            <div>
              <Button fullWidth type='submit' size='large' variant='contained' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
              </Button>
              { noCancelButton ? null : (
                <Button onClick={ onClose } fullWidth size='large' variant='text' color='primary' className={ classes.button } style={ { marginTop: 10 } }>
                  <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
                </Button>
              ) }
              { type === 'signin' && (
                <div style={ { marginTop: 20 } }>
                  <ProviderLoginButtons />
                </div>
              ) }
              <div style={ { marginTop: 20 } }>
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
              <Button type='submit' size='large' variant='contained' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
              </Button>
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
