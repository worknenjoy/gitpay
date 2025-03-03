import React from 'react';
import LoginFormSignup from './login-form-signup';

export default {
  title: 'Design Library/Molecules/Forms/LoginForm/LoginFormSignup',
  component: LoginFormSignup,
};

const Template = (args) => <LoginFormSignup {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here if any
};