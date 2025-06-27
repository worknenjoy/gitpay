import React from 'react';
import useStyles from './payment-request-active-field.styles';
import BaseStatus from 'design-library/atoms/status/base-status/base-status';

interface PaymentRequestActiveFieldProps {
  status: 'yes' | 'no';
  completed?: boolean;
}

const PaymentRequestActiveField: React.FC<PaymentRequestActiveFieldProps> = ({
  status,
  completed = true
}) => {
  const classes = useStyles();

  const statusList = [
    {
      status: 'yes',
      label: 'Yes',
      color: 'yes'
    },
    {
      status: 'no',
      label: 'No',
      color: 'no'
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

export default PaymentRequestActiveField;
