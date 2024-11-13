import React from 'react';
import Checkboxes from './checkboxes';

export default {
  title: 'Design Library/Molecules/Checkboxes',
  component: Checkboxes,
};

const Template = (args) => <Checkboxes {...args} />;

export const Default = Template.bind({});
Default.args = {
  checkboxes: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ],
};