import React from 'react';
import { useIntl } from 'react-intl';
import { Chip, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Constants from '../../../../../../consts'

const useStyles = makeStyles((theme) => ({
  chipStatusSuccess: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main
  },
  chipStatusClosed: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.error.main
  },
  avatarStatusSuccess: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.primary.main,
  },
  avatarStatusClosed: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.error.main,
  },
}));


const IssueStatusField = ({ issue }) => {
  const classes = useStyles();
  const intl = useIntl(); 
  return (
    <div style={{ width: 80 }}>
      <Chip 
        label={intl.formatMessage(Constants.STATUSES[issue.status])}
        avatar={<Avatar className={issue.status === 'closed' ? classes.avatarStatusClosed : classes.avatarStatusSuccess} style={{ width: 12, height: 12 }}>{' '}</Avatar>}
        className={issue.status === 'closed' ? classes.chipStatusClosed : classes.chipStatusSuccess}
      />
    </div>
  );
}

export default IssueStatusField;
