import React from 'react';
import BankSelectField from './bank-select-field';

export default {
  title: 'Design Library/Atoms/Inputs/Fields/BankSelectField',
  component: BankSelectField
};

const Template = (args) => <BankSelectField {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    data: {
      country: 'BR'
    }
  }
};