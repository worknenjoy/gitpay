import React from 'react';
import { Story, Meta } from '@storybook/react';
import BankCurrencyField from './bank-currency-field';

export default {
  title: 'Design Library/Atoms/Inputs/Fields/BankCurrencyField',
  component: BankCurrencyField,
} as Meta;

const Template = (args) => <BankCurrencyField {...args} />;

export const Default = Template.bind({});
Default.args = {
  countries: {
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling',
      },
    },
  },
  disabled: false,
  completed: false,
  onChange: (e) => console.log(e.target.value),
};
