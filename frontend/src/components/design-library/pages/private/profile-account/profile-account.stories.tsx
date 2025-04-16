import React from 'react';
import ProfileAccount from './profile-account';

export default {
  title: 'Design Library/Pages/Account',
  component: ProfileAccount,
};

const Template = (args) => <ProfileAccount {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'John Doe',
      Types: [
        { name: 'contributor' },
        { name: 'maintainer' },
        { name: 'funding' },
      ],
    },
  }
};