import React, { Component } from 'react'
import withRouter from 'react-router-dom/withRouter'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  withStyles,
  TextField
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
      type: 'signin',
      action: `${api.API_URL}/authorize/local`,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      validating: false
    }
  }

  handleBlur = () => {
    this.setState({ validating: true })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleType = type => event => {
    if (type === 'signin') {
      this.setState({ type: 'signin' })
    }

    if (type === 'signup') {
      this.setState({ type: 'signup', action: `${api.API_URL}/auth/register` })
    }
  }

  handleSubmit = event => {
    if (this.state.type === 'signup') {
      event.preventDefault()
      const { password, confirmPassword } = this.state
      if (password !== confirmPassword) return
      this.props.registerUser({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }).then((response) => {
        this.props.history.push('/login')
      })
    }
  }

  render () {
    const { classes } = this.props
    const { type, action } = this.state
    const { validating, password, confirmPassword } = this.state
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
            type='email'
            label='E-mail'
            variant='outlined'
            id='email'
          />
        </div>
        <div className={ classes.margins }>
          <TextField
            name='password'
            onChange={ this.handleChange('password') }
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
              <Button onClick={ this.handleType('signup') } variant='contained' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
              </Button>
              <Button type='submit' variant='contained' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
              </Button>
            </div>
          ) : (<div>
            <Button onClick={ this.handleType('signin') } variant='contained' color='primary' className={ classes.button }>
              <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
            </Button>
            <Button type='submit' variant='contained' color='primary' className={ classes.button }>
              <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
            </Button>
          </div>
          ) }
        </div>
      </form>
    )
  }
}

export default withRouter(withStyles(styles)(LoginForm))
