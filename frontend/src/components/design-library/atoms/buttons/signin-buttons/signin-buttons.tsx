import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SigninButtonsStyled, LinkButton, LabelButton } from './signin-buttons.styles'

const SigninButtons = ({ onSignup, onSignin }) => {
  return (
    <SigninButtonsStyled>
      <LinkButton onClick={onSignup} variant="text" size="small" color="primary">
        <LabelButton>
          <FormattedMessage id="topbar.signup.label" defaultMessage="Signup" />
        </LabelButton>
      </LinkButton>

      <LinkButton onClick={onSignin} variant="text" size="small" color="primary">
        <LabelButton>
          <FormattedMessage id="topbar.signin.label" defaultMessage="Signin" />
        </LabelButton>
      </LinkButton>
    </SigninButtonsStyled>
  )
}

export default SigninButtons
