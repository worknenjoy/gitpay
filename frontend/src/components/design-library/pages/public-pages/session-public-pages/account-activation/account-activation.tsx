import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { FormattedMessage } from 'react-intl';

const AccountActivation = ({ onActivateAccount }) => {
  const [open, setOpen] = React.useState(false);
  const [ activated, setActivated ] = React.useState(false);

  const { token, userId } = useParams<{ token: string; userId: string }>();

   useEffect(() => {
    const activate = async () => {
      const token = match.params.token;
      const userId = match.params.userId;
      const activateAccount = await onActivateAccount(token, userId);
      if(!activateAccount.error){
        setActivated(true);
      }
      setOpen(true);
    };
    activate();
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