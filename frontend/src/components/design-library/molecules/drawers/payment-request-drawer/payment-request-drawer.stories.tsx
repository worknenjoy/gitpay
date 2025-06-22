import React, { useState } from 'react';
import PaymentRequestDrawer from './payment-request-drawer';

const meta = {
  title: 'Design Library/Molecules/Drawers/PaymentRequestDrawer',
  component: PaymentRequestDrawer,
  args: {
    open: true,
    amount: 100,
    title: 'Request Payment',
    description: 'Please fill out the form to request payment'
  }
};

export default meta;

const DefaultStory = (args) => {
  const [open, setOpen] = useState(true);

  return (
    <PaymentRequestDrawer
      {...args}
      open={open}
      onClose={() => setOpen(false)}
    />
  );
};

export const Default = {
  render: (args) => <DefaultStory {...args} />
};