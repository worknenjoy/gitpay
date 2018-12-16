import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import { FormattedMessage } from 'react-intl'
import purple from 'material-ui/colors/purple'
import Button from 'material-ui/Button'

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
      action: `${api.API_URL}/authorize/local`
    }
  }

  handleChange = name => event => {
    // console.log(name, event.target.value)
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

  }

  render () {
    const { classes } = this.props
    const { type, action } = this.state
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
              id='custom-css-outlined-input'
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
            id='custom-css-outlined-input'
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
            id='custom-css-outlined-input'
          />
        </div>
        <div className={ classes.center } style={ { marginTop: 30 } }>
          { type === 'signin' ? (
            <div>
              <Button onClick={ this.handleType('signup') } variant='raised' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
              </Button>
              <Button type='submit' variant='raised' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signin' defaultMessage='Sign in' />
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={ this.handleType('signin') } variant='outline' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
              </Button>
              <Button variant='raised' color='primary' className={ classes.button }>
                <FormattedMessage id='account.login.label.signup' defaultMessage='Sign up' />
              </Button>
            </div>
          ) }
        </div>
      </form>
    )
  }
}

export default withStyles(styles)(LoginForm)
