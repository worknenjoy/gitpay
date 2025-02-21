import React from 'react';
import SignupSignin from './signup-signin';

export default {
  title: 'Design Library/Organisms/SignupSignin',
  component: SignupSignin,
};

const Template = (args) => <SignupSignin {...args} />;

export const Default = Template.bind({});
Default.args = {};