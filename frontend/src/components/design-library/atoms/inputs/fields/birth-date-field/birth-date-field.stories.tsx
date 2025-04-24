import React from 'react';
import { Meta, Story } from '@storybook/react';
import BirthDateField from './birth-date-field';

export default {
  title: 'Design Library/Atoms/Inputs/Fields/BirthDateField',
  component: BirthDateField,
};

const Template = (args) => <BirthDateField {...args} />;

export const Default = Template.bind({});
Default.args = {
  
};