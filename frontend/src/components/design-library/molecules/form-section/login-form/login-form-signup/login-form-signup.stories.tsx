import React from 'react';
import LoginFormSignup from './login-form-signup';
import { compact } from 'lodash';

export default {
  title: 'Design Library/Molecules/Forms/LoginForm/LoginFormSignup',
  component: LoginFormSignup,
};

const Template = (args) => <LoginFormSignup {...args} />;

export const Default = Template.bind({});
Default.args = {
  roles: {
    completed: true,
    data: [
      { id: '1', name: 'contributor' },
      { id: '2', name: 'sponsor' },
      { id: '3', name: 'maintainer' },
    ],
  },
  fetchRoles: () => {},
};