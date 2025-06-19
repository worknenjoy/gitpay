import React from 'react';
import Drawer from '../drawer/drawer';
import PaymentRequestForm from '../../../organisms/forms/payment-request-form/payment-request-form';

interface PaymentRequestDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PaymentRequestDrawer: React.FC<PaymentRequestDrawerProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="New Payment request"
      subtitle="Please fill out the form to request payment"
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'text',
        },
        {
          label: 'Create Payment Request',
          onClick: onSuccess,
          variant: 'contained',
          color: 'secondary',
        },
      ]}
    >
      <PaymentRequestForm
        onSubmit={onSuccess}
        user={{ completed: true, data: { country: 'US' } }} // Example user data
        paymentRequest={{ completed: true, data: { amount: 100, currency: 'USD', description: 'Payment for services rendered' } }}  
      />
    </Drawer>
  );
};

export default PaymentRequestDrawer;