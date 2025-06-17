import React from 'react';
import Button from './button';

export default {
  title: 'Design Library/Atoms/Buttons/Button',
  component: Button
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  variant: 'contained',
  color: 'primary',
  completed: true,
  onClick: () => alert('Button clicked!')
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Loading Button',
  variant: 'contained',
  completed: false
};