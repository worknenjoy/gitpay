import React from 'react';
import useStyles from './payment-status.styles';
import BaseStatus from '../../base-status/base-status';
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon
} from '@material-ui/icons';

interface PaymentStatusProps {
  status: string;
  completed?: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  completed = true
}) => {
  const classes = useStyles();

  const statusList = [
    {
      status: 'open',
      label: 'Open',
      color: 'open',
      icon: <InfoIcon className={classes.open} />
    },
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon className={classes.pending} />,
      message: 'Your payment is pending. Please wait while we process it.'
    },
    {
      status: 'succeeded',
      label: 'Succeeded',
      color: 'succeeded',
      icon: <ActiveIcon className={classes.succeeded} />
    },
    {
      status: 'failed',
      label: 'Failed',
      color: 'failed',
      icon: <InactiveIcon className={classes.failed} />,
      message: 'Your payment has failed. Please try again or contact support.'
    },
    {
      status: 'expired',
      label: 'Expired',
      color: 'expired',
      icon: <InactiveIcon className={classes.expired} />
    },
    {
      status: 'canceled',
      label: 'Canceled',
      color: 'canceled',
      icon: <InactiveIcon className={classes.canceled} />
    },
    {
      status: 'refunded',
      label: 'Refunded',
      color: 'refunded',
      icon: <InfoIcon className={classes.refunded} />
    },
    {
      status: 'unknown',
      label: 'Unknown',
      color: 'unknown',
      icon: <QuestionInfoIcon className={classes.unknown} />,
      message: 'Your status is unknown. Please check back later.'
    }
  ];

  return (
    <BaseStatus
      status={status}
      statusList={statusList}
      classes={classes}
      completed={completed}
    />
  );
};

export default PaymentStatus;
