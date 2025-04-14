import React from 'react';
import PrivateBase from './private-base';
import { Typography } from '@material-ui/core';

export default {
  title: 'Design Library/Templates/Base/PrivateBase',
  component: PrivateBase,
};

const Template = (args) => <PrivateBase {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <div>
      <Typography variant='h4' gutterBottom>
        Private Base Template
      </Typography>
      <Typography variant='body1'>
        This is a private base template example.
      </Typography>
    </div>
  ),
  createTask: () => console.log('Create Task'),
  signOut: () => console.log('Sign Out'),
  user: {
    data: {
      id: '1',
      name: 'John Doe',
      Types: [
        { name: 'contributor' },
        { name: 'maintainer' },
        { name: 'funding' },
      ],
    },
    completed: true,
  }
};