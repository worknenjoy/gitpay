import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { purple } from '@material-ui/core/colors'

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

type LoginOnResetProps = {
  password: string
  token: string
}

type LoginFormResetProps = {
  action?: string
  onClose?: () => void
  onSignin?: () => void
  onReset?: ({ password, token}:LoginOnResetProps) => void
  noCancelButton?: boolean
}

type ErrorStateType = {
  password: boolean | JSX.Element
  confirmPassword: boolean | JSX.Element
}

const LoginFormReset = ({ action, noCancelButton, onClose, onSignin, onReset }:LoginFormResetProps) => {
  const classes = useStyles()
  const { token } = useParams<{ token: string }>()

  const [validatingPassword, setValidatingPassword] = useState(false)
  const [validatingConfirmPassword, setValidatingConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ error, setError ] = useState<ErrorStateType>({
    password: false,
    confirmPassword: false
  })

  const handleChangePassword = (event) =>{
    setPassword(event.target.value)
  }

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
  }

  const handleBlurPassword = () => {
    setValidatingPassword(true)
  }

  const handleFocusPassword = () => {
    setValidatingPassword(false)
  }

  const handleBlurConfirmPassword = () => {
    setValidatingConfirmPassword(true)
  }

  const handleFocusConfirmPassword = () => {
    setValidatingConfirmPassword(false)
  }

  const validForm = !error.password && !error.confirmPassword

  const submitByFormType = async (event) => {
    event.preventDefault()
    const password = event.target.password.value
    if(validForm) {
      await onReset({ password, token })
    }
  }

  useEffect(() => {
    if(validatingPassword) {
      if (password.length < 7) {
        setError({ ...error, password: <FormattedMessage id='user.password.error.minimum' defaultMessage='Password must be at least 8 characters' /> })
      } else if (password.length > 72) {
        setError({ ...error, password: <FormattedMessage id='user.password.error.maximum' defaultMessage='Password cannot be longer than 72 characters' /> })
      } else {
        setError({ ...error, password: false })
      }
    }
  }, [password, confirmPassword, validatingPassword])

  useEffect(() => {
    if(validatingConfirmPassword) {
      if (password !== confirmPassword) {
        setError({ ...error, confirmPassword: <FormattedMessage id='user.confirm.password.error' defaultMessage='Passwords do not match' /> })
      } else {
        setError({ ...error, confirmPassword: false })
      }
    }
  }, [password, confirmPassword, validatingConfirmPassword])

  return (
    <form onSubmit={submitByFormType} action={action} method='POST' autoComplete='off'>
      <div className={ classes.margins }>
        <TextField
          name='password'
          onChange={ handleChangePassword }
          onBlur={ handleBlurPassword }
          onFocus={ handleFocusPassword }
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
          error={ !!error.confirmPassword }
          helperText={ error.confirmPassword }
          name='confirm_password'
          onChange={handleChangeConfirmPassword}
          onBlur={handleBlurConfirmPassword}
          onFocus={ handleFocusConfirmPassword }
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
