import React from 'react';
import BankAccountForm from './bank-account-form';

export default {
  title: 'Design Library/Organisms/Forms/BankAccountForm',
  component: BankAccountForm,
};

const Template = (args) => <BankAccountForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    completed: true,
    data: {
      country: 'BR',
    },
  },
  bankAccount: {
    completed: true,
    data: {
      routing_number: '123456',
      account_number: '123456789',
      account_type: 'individual',
      bank_id: '123456',
      currency: 'USD',
    },
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling',
      },
    },
  },
};

export const Loading = Template.bind({});
Loading.args = {
  user: {
    completed: false,
    data: {},
  },
  bankAccount: {
    completed: false,
    data: {},
  },
  countries: {
    completed: false,
    data: {},
  },
};
export const Error = Template.bind({});