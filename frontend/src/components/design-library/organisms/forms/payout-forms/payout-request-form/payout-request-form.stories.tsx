import React from 'react';
import PayoutRequestForm from './payout-request-form'

export default {
  title: 'Design Library/Organisms/Forms/PayoutForms/PayoutRequestForm',
  component: PayoutRequestForm
};

const Template = (args) => <PayoutRequestForm {...args} />;

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
