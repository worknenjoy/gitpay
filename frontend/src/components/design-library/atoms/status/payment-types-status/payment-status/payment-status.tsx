import React from 'react';
import BaseStatus from '../../base-status/base-status';
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon
} from '@mui/icons-material';
import StyledStatus from './payment-status.styles';

interface PaymentStatusProps {
  status: string;
  completed?: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  completed = true
}) => {
  const statusList = [
    {
      status: 'open',
      label: 'Open',
      color: 'open',
      icon: (
        <StyledStatus className="open">
          <InfoIcon />
        </StyledStatus>
      )
    },
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: (
        <StyledStatus className="pending">
          <InfoIcon />
        </StyledStatus>
      ),
      message: 'Your payment is pending. Please wait while we process it.'
    },
    {
      status: 'succeeded',
      label: 'Succeeded',
      color: 'succeeded',
      icon: (
        <StyledStatus className="succeeded">
          <ActiveIcon />
        </StyledStatus>
      )
    },
    {
      status: 'failed',
      label: 'Failed',
      color: 'failed',
      icon: (
        <StyledStatus className="failed">
          <InactiveIcon />
        </StyledStatus>
      ),
      message: 'Your payment has failed. Please try again or contact support.'
    },
    {
      status: 'expired',
      label: 'Expired',
      color: 'expired',
      icon: (
        <StyledStatus className="expired">
          <InactiveIcon />
        </StyledStatus>
      )
    },
    {
      status: 'canceled',
      label: 'Canceled',
      color: 'canceled',
      icon: (
        <StyledStatus className="canceled">
          <InactiveIcon />
        </StyledStatus>
      )
    },
    {
      status: 'refunded',
      label: 'Refunded',
      color: 'refunded',
      icon: (
        <StyledStatus className="refunded">
          <InfoIcon />
        </StyledStatus>
      )
    },
    {
      status: 'unknown',
      label: 'Unknown',
      color: 'unknown',
      icon: (
        <StyledStatus className="unknown">
          <QuestionInfoIcon />
        </StyledStatus>
      ),
      message: 'Your status is unknown. Please check back later.'
    }
  ];

  return (
    <BaseStatus
      classes={{
        open: 'open',
        pending: 'pending',
        succeeded: 'succeeded',
        failed: 'failed',
        expired: 'expired',
        canceled: 'canceled',
        refunded: 'refunded',
        unknown: 'unknown'
      }}
      status={status}
      statusList={statusList}
      completed={completed}
    />
  );
};

export default PaymentStatus;
