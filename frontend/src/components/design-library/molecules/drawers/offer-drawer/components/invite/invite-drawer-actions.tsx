import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const OfferDrawerActions = ({ disabled, onClose }) => {
  const classes = useStyles();

  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', margin: 10}}>
    <Button onClick={onClose} color="primary" style={{marginRight: 10}}>
      <FormattedMessage id="task.bounties.actions.cancel" defaultMessage="Cancel" />
    </Button>
    <Button type="button" variant="contained" color="primary" disabled={disabled}>
      <FormattedMessage id="task.funding.form.send" defaultMessage="Send Invite" />
    </Button>
  </div>
  );
};

export default OfferDrawerActions;