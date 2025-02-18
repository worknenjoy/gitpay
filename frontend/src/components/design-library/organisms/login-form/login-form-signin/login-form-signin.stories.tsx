import React from 'react';
import LoginFormSignin from './login-form-signin';

export default {
  title: 'Design Library/Organisms/LoginForm/LoginFormSignin',
  component: LoginFormSignin,
};

const Template = (args) => <LoginFormSignin {...args} />;

export const Signin = Template.bind({});
Signin.args = {};