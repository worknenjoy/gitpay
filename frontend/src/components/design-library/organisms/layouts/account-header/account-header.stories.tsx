import React from 'react';
import AccountHeader from './account-header';

export default {
  title: 'Design Library/Organisms/Layout/AccountHeader',
  component: AccountHeader,
};

const Template = (args) => <AccountHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    id: 1,
    username: 'Test User',
    Types: [
      {
        id: 1,
        name: 'contributor',
      },
      {
        id: 2,
        name: 'maintainer',
      },
      {
        id: 3,
        name: 'funding',
      },
    ]
  }
};