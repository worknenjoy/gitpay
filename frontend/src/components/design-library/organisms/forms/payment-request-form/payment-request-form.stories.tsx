import React from 'react';
import PaymentRequestForm from './payment-request-form';

export default {
  title: 'Design Library/Organisms/Forms/PaymentRequestForm',
  component: PaymentRequestForm
};

const Template = (args) => <PaymentRequestForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    completed: true,
    data: {
      country: 'US'
    }
  },
  paymentRequest: {
    completed: true,
    data: {
      amount: 100,
      currency: 'USD',
      description: 'Payment for services rendered'
    }
  }
};

export const Loading = Template.bind({});
Loading.args = {
  user: {
    completed: false,
    data: {}
  },
  bankAccount: {
    completed: false,
    data: {}
  },
  countries: {
    completed: false,
    data: {}
  }
};
