import React, { useRef } from 'react';
import Drawer from '../drawer/drawer';
import PayoutRequestForm from '../../../organisms/forms/payout-forms/payout-request-form/payout-request-form';

interface PayoutRequestDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (e:any, data:any) => void;
  completed?: boolean;
  balance?: number;
  currency?: string;
}

const PayoutRequestDrawer: React.FC<PayoutRequestDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  completed = true,
  balance,
  currency = 'usd'
}) => {
  const formRef = useRef<{ submit: () => void }>(null);
  
  return (
    <Drawer
      completed={completed}
      open={open}
      onClose={onClose}
      title="Request a new Payout"
      subtitle="Please choose the amount to request a payout to your bank account"
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'text'
        },
        {
          label: 'Request payout',
          onClick: () => {
            formRef.current?.submit();
          },
          variant: 'contained',
          color: 'secondary',
          disabled: !balance || balance <= 0 // Disable if no balance
        }
      ]}
    >
      <PayoutRequestForm
        ref={formRef}
        onSubmit={onSuccess}
        completed={completed}
        balance={balance}
        currency={currency}
      />
    </Drawer>
  );
};

export default PayoutRequestDrawer;