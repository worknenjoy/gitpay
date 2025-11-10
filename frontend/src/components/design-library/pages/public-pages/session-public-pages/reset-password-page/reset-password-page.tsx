import React from 'react';
import { Skeleton } from '@mui/material';
import SpotCard from 'design-library/molecules/cards/spot-card/spot-card';
import LoginFormReset from 'design-library/molecules/form-section/login-form/login-form-reset/login-form-reset';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

const ResetPasswordPage = ({
  user,
  resetPassword
}) => {
  const history = useHistory()
  const { data, completed } = user || {}

  return (
    <SpotCard
      title={<FormattedMessage id="resetPassword.title" defaultMessage="Reset Your Password" />}
      description={
        completed ?
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <FormattedMessage
            id="session.passwordReset.description"
            defaultMessage="Hello <strong>{username}</strong> (<strong>{email}</strong>), {br} please enter your new password below and confirm to reset your password."
            values={{
              username: data?.username,
              email: data?.email,
              strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              br: <br />
            }}
          />
        </div> : <Skeleton height={20} />
      }
    >
      <LoginFormReset
        onSignin={() => history.push('/signin')}
        onClose={() => history.push('/')}
        onReset={resetPassword}
        noCancelButton
      />
    </SpotCard>
  );
};

export default ResetPasswordPage;
