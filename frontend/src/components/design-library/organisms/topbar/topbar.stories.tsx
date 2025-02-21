import React from 'react';
import Topbar from './topbar';

export default {
  title: 'Design Library/Organisms/Topbar',
  component: Topbar,
};

const Template = (args: any) => <Topbar {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  // Add default props here
  user: {
    completed: true,
    data: {
      id: 1,
      Types: [{
        id: 1,
        name: 'contributor',
      }],
    },
    error: false,
  }
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  // Add default props here
  user: {
    
  }
};