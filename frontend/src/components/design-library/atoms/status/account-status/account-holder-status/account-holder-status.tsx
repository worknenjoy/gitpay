import React from 'react';
import useStyles from './account-holder-status.styles'
import { 
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon
} from '@material-ui/icons';

import BaseStatus from '../../base-status/base-status';


interface AccountHolderStatusProps {
  status: string;
  completed?: boolean; // Optional prop to indicate if the status is completed
}

const AccountHolderStatus: React.FC<AccountHolderStatusProps> = ({
  status,
  completed = true, // Default to true if not provided
}) => {
  const classes = useStyles();
  
  const statusList = [
    { status: 'pending', label: 'Pending', color: 'pending', icon: <InfoIcon className={classes.pending} />, message: 'Your status is pending. Please provide additional information to complete your profile.' },
    { status: 'active', label: 'Active', color: 'active', icon: <ActiveIcon className={classes.active} /> },
    { status: 'inactive', label: 'Inactive', color: 'inactive', icon: <InactiveIcon className={classes.inactive} />, message: 'Your account is inactive. Please complete all required information. If your account remains inactive, contact support at issues@gitpay.me for assistance.' },
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
export default AccountHolderStatus;