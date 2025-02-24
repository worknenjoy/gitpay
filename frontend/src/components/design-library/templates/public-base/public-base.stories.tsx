import React from 'react';
import PublicBase from './public-base';

export default {
  title: 'Design Library/Templates/PublicBase',
  component: PublicBase,
};

const Template = (args) => <PublicBase {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  children: 'This is a public base template',
  loggedIn: {
    logged: false,
    user: null,
    error: null,
  },
  bottomBarProps: {
    info: {
      tasks: 0,
      bounties: 0,
      users: 0,
    },
    getInfo: () => {},
  },
  accountMenuProps: {
    signOut: () => {},
  },
};
