import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { FormattedMessage } from 'react-intl';

const AccountActivation = ({ activateAccount, match, history }) => {
  const [open, setOpen] = React.useState(false);
  const [ activated, setActivated ] = React.useState(false);

   useEffect(() => {
    const token = match.params.token;
    const userId = match.params.userId;
    activateAccount(token, userId).then((data) => {
      if (!data.error) {
        setActivated(true);
      }
    });
    setOpen(true);
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
        {activated ? (
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage id="account.activated" defaultMessage="Your account is active now, you can now back to login" />
          </DialogContentText>
          ) : (
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="account.not.activated" defaultMessage="Your account is not active, please try again" />
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => history.push('/signin')}>
            <FormattedMessage id="close" defaultMessage="back to login" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AccountActivation;