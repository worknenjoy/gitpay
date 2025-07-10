import React from 'react';
import useStyles from './invoice-status.styles';
import BaseStatus from '../../base-status/base-status';
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon
} from '@material-ui/icons';

interface InvoiceStatusProps {
  status: string;
  completed?: boolean;
}

const InvoiceStatus: React.FC<InvoiceStatusProps> = ({
  status,
  completed = true
}) => {
  const classes = useStyles();

  const statusList = [
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon className={classes.pending} />,
      message: 'Your invoice is pending. It may require additional actions to complete.'
    },
    {
      status: 'draft',
      label: 'Draft',
      color: 'draft',
      icon: <InactiveIcon className={classes.draft} />,
      message: 'This invoice is in draft state and has not been finalized yet.'
    },
    {
      status: 'open',
      label: 'Open',
      color: 'open',
      icon: <InfoIcon className={classes.open} />
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'paid',
      icon: <ActiveIcon className={classes.paid} />
    },
    {
      status: 'failed',
      label: 'Failed',
      color: 'failed',
      icon: <InactiveIcon className={classes.failed} />,
      message: 'This invoice payment has failed. Please retry or contact support.'
    },
    {
      status: 'uncollectible',
      label: 'Uncollectible',
      color: 'uncollectible',
      icon: <InactiveIcon className={classes.uncollectible} />
    },
    {
      status: 'void',
      label: 'Void',
      color: 'void',
      icon: <InactiveIcon className={classes.void} />
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

export default InvoiceStatus;
