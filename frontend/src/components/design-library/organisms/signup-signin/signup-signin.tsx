import React from 'react';
import SigninButtons from '../../molecules/signin-buttons/signin-buttons';
import SignupDialog from '../signup-dialog/signup-dialog';

const SignupSignin = () => {
  const [ open, setOpen] = React.useState(false);
  const [ mode, setMode] = React.useState('signin');
  return (
    <div>
      <SigninButtons
        onSignin={() => {
          setOpen(true);
          setMode('signin');
        }}
        onSignup={() => {
          setOpen(true);
          setMode('signup');
        }}
      />
      <SignupDialog
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        onForgot={() => setMode('forgot')}
        onSignup={() => setMode('signup')}
        onSignin={() => setMode('signin')}
      />
    </div>
  );
}

export default SignupSignin;