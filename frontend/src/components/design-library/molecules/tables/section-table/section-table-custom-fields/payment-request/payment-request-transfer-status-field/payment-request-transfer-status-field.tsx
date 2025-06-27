import React from 'react';
import useStyles from './payment-request-status-field.styles';



import BaseStatus from 'design-library/atoms/status/base-status/base-status';

interface PaymentRequestTransferStatusFieldProps {
  status: 'pending_payment' | 'initiated' | 'completed' | 'error';
  completed?: boolean;
}

const PaymentRequestTransferStatusField: React.FC<PaymentRequestTransferStatusFieldProps> = ({
  status,
  completed = true
}) => {
  const classes = useStyles();

  const statusList = [
    {
      status: 'pending_payment',
      label: 'Pending Payment',
      color: 'pending'
    },
    {
      status: 'initiated',
      label: 'Initiated',
      color: 'initiated'
    },
    {
      status: 'completed',
      label: 'Completed',
      color: 'completed'
    },
    {
      status: 'error',
      label: 'Error',
      color: 'error'
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

export default PaymentRequestTransferStatusField;