import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../atoms/buttons/button/button';

const ActivateAccountDialog = ({ open, onResend, completed }) => {
  return (
    <Dialog open={ open }>
      <DialogTitle itemType="h4">
        <FormattedMessage
          id="account.profile.email.verification"
          defaultMessage="Please check your e-mail"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            id="account.profile.email.verification.message"
            defaultMessage="Please check your email inbox to validate your account to proceed"
          />
        </DialogContentText>
        <DialogContentText>
          <FormattedMessage
            id="account.profile.email.verification.message2"
            defaultMessage="If you have not received the email, please check your spam folder"
          />
        </DialogContentText>
        <DialogContentText>
          <FormattedMessage
            id="account.profile.email.verification.message3"
            defaultMessage="If you have not received the email, please click here to resend"
          />
        </DialogContentText>
        <DialogActions>
          <Button 
            completed={ completed }
            onClick={ onResend }
            color="primary"
            variant="contained"
            label={<FormattedMessage id="user.email.resend.link.label" defaultMessage="Resend verification link to your email" />}
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
export default ActivateAccountDialog;