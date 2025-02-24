import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { purple } from '@material-ui/core/colors'

type LoginFormResetProps = {
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

const LoginFormReset = ({ action, noCancelButton, onClose, onSignin }:LoginFormResetProps) => {
  const classes = useStyles()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validating, setValidating] = useState(false)
  const [password, setPassword] = useState('')
  const [ error, setError ] = useState({
    captcha: '',
    email: '',
    password: '',
    username: ''
  })

  const handleChange = (setter) => (event) => {
    setter(event.target.value)
  }

  const handleBlur = () => {
    setValidating(true)
  }

  const submitByFormType = (event) => {
    event.preventDefault()
    // Add your form submission logic here
  }

  return (
    <form onSubmit={submitByFormType} action={action} method='POST' autoComplete='off'>
      <div className={ classes.margins }>
        <TextField
          name='password'
          onChange={ handleChange('password') }
          onBlur={ handleBlur }
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
          error={ !!error.password }
          helperText={ error.password }
          defaultValue={ password }
        />
      </div>
      <div className={classes.margins}>
        <TextField
          error={validating && password !== confirmPassword}
          helperText={validating && password !== confirmPassword ? <FormattedMessage id='user.confirm.password.error' defaultMessage='Passwords do not match' /> : ''}
          name='confirm_password'
          onChange={handleChange(setConfirmPassword)}
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
          defaultValue={confirmPassword}
        />
      </div>
      <div className={classes.center} style={{ marginTop: 20 }}>
        <div>
          {noCancelButton ? null : (
            <Button onClick={onClose} size='large' variant='text' color='primary' className={classes.button}>
              <FormattedMessage id='account.login.label.cancel' defaultMessage='Cancel' />
            </Button>
          )}
          <Button type='submit' size='large' variant='contained' color='primary' className={classes.button}>
            <FormattedMessage id='account.login.label.password.reset' defaultMessage='Reset password' />
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

export default LoginFormReset
