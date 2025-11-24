import React from 'react'
import SigninButtons from '../../../../atoms/buttons/signin-buttons/signin-buttons'
import SignupDialog from '../../../../molecules/dialogs/signup-dialog/signup-dialog'
import { SecondaryActionsContainerStyled } from './signup-signin.styles'

const SignupSignin = ({ loginFormSignupFormProps, loginFormForgotFormProps }) => {
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState('signin')
  return (
    <SecondaryActionsContainerStyled>
      <SigninButtons
        onSignin={() => {
          setOpen(true)
          setMode('signin')
        }}
        onSignup={() => {
          setOpen(true)
          setMode('signup')
        }}
      />
      <SignupDialog
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        onForgot={() => setMode('forgot')}
        onSignup={() => setMode('signup')}
        onSignin={() => setMode('signin')}
        loginFormSignupFormProps={loginFormSignupFormProps}
        loginFormForgotFormProps={loginFormForgotFormProps}
      />
    </SecondaryActionsContainerStyled>
  )
}

export default SignupSignin
