import React from 'react';
import { green, orange } from '@material-ui/core/colors';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { 
  CheckCircleOutlineTwoTone as ActiveIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon
} from '@material-ui/icons';

import BaseStatus from '../../base-status/base-status';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pending: {
      backgroundColor: orange[500],
      color: theme.palette.common.white,
    },
    active: {
      backgroundColor: green[500],
      color: theme.palette.common.white,
    },
    inactive: {
      backgroundColor: theme.palette.grey[400],
      color: theme.palette.common.white,
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white,
    },
  }),
);

interface BankAccountStatusProps {
  status: string;
  completed?: boolean; // Optional prop to indicate if the status is completed
}

const BankAccountStatus: React.FC<BankAccountStatusProps> = ({
  status,
  completed = true, // Default to true if not provided
}) => {
  const classes = useStyles();
  
  const statusList = [
    { status: 'new', label: 'Active', color: 'active', icon: <ActiveIcon className={classes.active} /> },
    { status: 'validated', label: 'Active', color: 'active', icon: <ActiveIcon className={classes.active} /> },
    { status: 'verified', label: 'Active', color: 'active', icon: <ActiveIcon className={classes.active} /> },
    { status: 'errored', label: 'Inactive', color: 'inactive', icon: <InactiveIcon className={classes.inactive} />, message: 'Your bank account is inactive. Please complete all required information. If your account remains inactive, contact support at issues@gitpay.me for assistance.' },
    { status: 'verification_failed', label: 'Inactive', color: 'inactive', icon: <InactiveIcon className={classes.inactive} />, message: 'Your bank account is inactive. Please complete all required information. If your account remains inactive, contact support at issues@gitpay.me for assistance.' },
    { status: 'unknown', label: 'Unknown', color: 'unknown', icon: <QuestionInfoIcon className={classes.unknown} />, message: 'Your status is unknown. Please check back later.' },
  ];

  return (
    <BaseStatus
      status={status}
      statusList={statusList}
      classes={classes}
      completed={completed}
    />
  )
};
export default BankAccountStatus;