import React from 'react';
import Topbar from './topbar';

export default {
  title: 'Design Library/Organisms/Topbar',
  component: Topbar,
};

const Template = (args: any) => <Topbar {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  loggedIn: {
    logged: true,
    completed: true,
    user: {
      id: 1,
      email: 'test@gmail.com',
      username: 'test',
      Types: [{
        id: 1,
        name: 'maintainer',
      }]
    }
  }
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  // Add default props here
  user: {
    
  }
};