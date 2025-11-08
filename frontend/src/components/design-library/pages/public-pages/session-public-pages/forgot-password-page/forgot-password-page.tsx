import React from 'react';
import { FormattedMessage } from 'react-intl';
import SpotCard from 'design-library/molecules/cards/spot-card/spot-card';
import LoginFormForgot from 'design-library/molecules/form-section/login-form/login-form-forgot/login-form-forgot';
import { useHistory } from 'react-router-dom';

const ForgotUserPage = ({
  forgotPassword,
}) => {
  const history = useHistory()
  return (
    <SpotCard
      title={<FormattedMessage id="forgotUser.title" defaultMessage="Forgot Your Password?" />}
      description={<FormattedMessage id="forgotUser.description" defaultMessage="Please enter your email to reset your password" />}
    >
      <LoginFormForgot
        onSignin={() => history.push('/signin')}
        onClose={() => history.push('/')}
        onSubmit={forgotPassword}
        noCancelButton
      />
    </SpotCard>
  );
};

export default ForgotUserPage;
