import React from 'react';
import AccountButton from './account-button';

export default {
  title: 'Design Library/Molecules/AccountButton',
  component: AccountButton,
};

const Template = (args) => <AccountButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  handleMenu: () => console.log('handleMenu'),
  user: {
    completed: true,
    data: {
      email: 'test@gmail.com',
      username: 'Test User',
      picture_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    },
    error: null,
  }
};