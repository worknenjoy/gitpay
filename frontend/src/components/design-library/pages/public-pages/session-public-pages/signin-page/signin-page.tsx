import SpotCard from 'design-library/molecules/cards/spot-card/spot-card'
import LoginFormSignin from 'design-library/molecules/form-section/login-form/login-form-signin/login-form-signin'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

const SigninPage = ({ addNotification }) => {
  const history = useHistory()
  return (
    <SpotCard
      title={<FormattedMessage id="signin.welcomeBack" defaultMessage="Welcome back!" />}
      description={
        <FormattedMessage id="signin.description" defaultMessage="Sign in to your account" />
      }
    >
      <LoginFormSignin
        addNotification={addNotification}
        onSignup={() => history.push('/signup')}
        onForgot={() => history.push('/forgot')}
        noCancelButton
      />
    </SpotCard>
  )
}

export default SigninPage
