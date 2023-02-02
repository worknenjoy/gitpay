import React, { Component } from 'react'
import withRouter from 'react-router-dom/withRouter'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  withStyles,
  TextField,
  Typography,
  FormControl
} from '@material-ui/core'
import purple from '@material-ui/core/colors/purple'

import api from '../../consts'

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
    marginRight: 20
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      validating: false,
      error: {}
    }
  }

  componentDidMount () {
    const modeByPath = this.props.location.pathname.split('/')[1]
    this.handleType(this.props.mode || modeByPath)
  }

  handleBlur = (event) => {
    this.setState({ validating: true, error: {} })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleType = type => {
    if (type === 'signin') {
      this.setState({type: type,  action: `${api.API_URL}/authorize/local` })
    }

    if (type === 'signup') {
      this.setState({ type: type, action: `${api.API_URL}/auth/register` })
    }
    return false;
  }

  validateEmail = (email, currentErrors) => {
    if(email.length < 3) {
      this.setState({
        error: {
          ...currentErrors,
          email: 'Email cannot be empty'
        }
      })
      return false
    }
    if(!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      this.setState({
        error: {
          ...currentErrors,
          email: 'Invalid email'
        }
      })
      return false
    }
    return true
  }

  validatePassword = (password, currentErrors) => {
    if(password.length < 3) {
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
    if(password !== confirmPassword) {
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
    const { email, password, confirmPassword } = this.state
    if (this.state.type === 'signup') {
      event && event.preventDefault()
      const validPassword = this.validatePassword(password, currentErrors)
      const validPasswordConfirm = this.validatePasswordDontMatch(password, confirmPassword, currentErrors)
      const validEmail = this.validateEmail(email, currentErrors)
      validPassword && validPasswordConfirm && validEmail &&
      this.props.registerUser({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }).then((response) => {
        const errorType = response.error.response.data.message
        if(errorType ==='user.exist') {
         window.location.reload('/#/signin')
        } else {
          this.props.history.push('/signup')
        }
      }).catch((error) => {
        this.setState({
          error: {
            ...currentErrors,
            'general': 'We couldnt register this user'
          }
        })
      });

    } else {
     this.validateEmail(email, currentErrors)
     this.validatePassword(password, currentErrors)
    }
  }

  render () {
    const { classes, onClose } = this.props
    const { action, type } = this.state
    const { validating, password, confirmPassword, error } = this.state
    return (
      <form onSubmit={ this.handleSubmit } action={ action } method='POST' autoComplete='off' style={ { marginBottom: 40 } }>
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
            name='email'
            onChange={ this.handleChange('email') }
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
            id='email'
            error={error.email}
            helperText={ error.email }
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
            error={error.password}
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
        <div className={ classes.center } style={ { marginTop: 30 } }>
          { type === 'signin' ? (
            <div>
              <Button onClick={ onClose } variant='text' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
              </Button>
              <Button type='submit' variant='contained' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
              </Button>
              <div style={{marginTop: 40}}>
                <Typography type='body1' component='span'>
                  <FormattedMessage id='account.login.label.or' defaultMessage='or' />
                </Typography>
                <Button onClick={ () => this.handleType('signup') } variant='text' color='primary'>
                  <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
                </Button>
                <Typography type='body1' component='span'>
                  <FormattedMessage id='account.login.label.instead' defaultMessage='instead' />
                </Typography>
              </div>
            </div>
          ) : (<div>
            <Button onClick={ onClose } variant='text' color='primary' className={ classes.button }>
              <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
            </Button>
            <Button type='submit' variant='contained' color='primary' className={ classes.button }>
              <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
            </Button>
            <div style={{marginTop: 40}}>
              <Typography type='body1' component='span'>
                <FormattedMessage id='account.login.label.or' defaultMessage='or' />
              </Typography>
              <Button onClick={ () => this.handleType('signin') } variant='text' color='primary'>
                <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
              </Button>
              <Typography type='body1' component='span'>
                <FormattedMessage id='account.login.label.instead' defaultMessage='instead' />
              </Typography>
            </div>
          </div>
          ) }
        </div>
      </form>
    )
  }
}

export default withRouter(withStyles(styles)(LoginForm))
