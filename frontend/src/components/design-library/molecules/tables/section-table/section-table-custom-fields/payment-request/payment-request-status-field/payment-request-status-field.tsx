import React from 'react';
import useStyles from './payment-request-status-field.styles';



import BaseStatus from 'design-library/atoms/status/base-status/base-status';

interface PaymentRequestStatusFieldProps {
  status: 'open' | 'paid';
  completed?: boolean;
}

const PaymentRequestStatusField: React.FC<PaymentRequestStatusFieldProps> = ({
  status,
  completed = true
}) => {
  const classes = useStyles();

  const statusList = [
    {
      status: 'open',
      label: 'Open',
      color: 'open'
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'paid'
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

export default PaymentRequestStatusField;