import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import LoginForm from '../login-form/login-form-main/login-form'



const SignupDialog = ({ open, onClose, mode, onForgot, onSignup, onSignin }) => {

  return (
    <Dialog
      open={ open }
      onClose={ onClose }
      aria-labelledby='form-dialog-title'
    >
      <DialogContent>
        <div style={ { display: 'flex', justifyContent: 'center', position: 'relative' } }>
          <LoginForm
            mode={mode}
            onClose={onClose}
            onForgot={onForgot}
            onSignup={onSignup}
            onSignin={onSignin}
            location={undefined}
            history={undefined}
            match={undefined}
            classes={undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignupDialog;