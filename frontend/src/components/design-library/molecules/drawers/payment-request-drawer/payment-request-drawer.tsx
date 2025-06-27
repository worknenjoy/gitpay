import React, { useRef } from 'react';
import Drawer from '../drawer/drawer';
import PaymentRequestForm from '../../../organisms/forms/payment-request-form/payment-request-form';

interface PaymentRequestDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (e:any, data:any) => void;
  completed?: boolean;
}

const PaymentRequestDrawer: React.FC<PaymentRequestDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  completed = true
}) => {
  const formRef = useRef<{ submit: () => void }>(null);
  
  return (
    <Drawer
      completed={completed}
      open={open}
      onClose={onClose}
      title="New Payment request"
      subtitle="Please fill out the form to request payment"
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'text'
        },
        {
          label: 'Create Payment Request',
          onClick: () => {
            formRef.current?.submit();
          },
          variant: 'contained',
          color: 'secondary'
        }
      ]}
    >
      <PaymentRequestForm
        ref={formRef}
        onSubmit={onSuccess}
        completed={completed}
      />
    </Drawer>
  );
};

export default PaymentRequestDrawer;