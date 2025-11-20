import React from 'react'
import { Dialog, DialogContent } from '@mui/material'
import LoginForm from '../../form-section/login-form/login-form-main/login-form'

const SignupDialog = ({
  open,
  onClose,
  mode,
  onForgot,
  onSignup,
  onSignin,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <LoginForm
            mode={mode}
            onClose={onClose}
            onForgot={onForgot}
            onSignup={onSignup}
            onSignin={onSignin}
            loginFormSignupFormProps={loginFormSignupFormProps}
            loginFormForgotFormProps={loginFormForgotFormProps}
            location={undefined}
            history={undefined}
            match={undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignupDialog
