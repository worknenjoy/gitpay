import SpotCard from 'design-library/molecules/cards/spot-card/spot-card';
import LoginFormSignup from 'design-library/molecules/form-section/login-form/login-form-signup/login-form-signup';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

const SignupPage = ({
  handleSignup,
  roles,
  fetchRoles
}) => {
  const history = useHistory();
  return (
    <SpotCard
      title={<FormattedMessage id="signup.welcome" defaultMessage="Welcome!" />}
      description={<FormattedMessage id="signup.description" defaultMessage="Create your account" />}
    >
      <LoginFormSignup
        onSignin={() => history.push('/signin')}
        onSubmit={handleSignup}
        roles={roles}
        fetchRoles={fetchRoles}
        noCancelButton
      />
    </SpotCard>
  );
};

export default SignupPage;