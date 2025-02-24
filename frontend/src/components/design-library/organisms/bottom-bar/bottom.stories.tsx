import React from 'react';
import Bottom from './bottom';

export default {
  title: 'Design Library/Organisms/Bottom',
  component: Bottom,
};

const Template = (args) => <Bottom {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  getInfo: () => {},
  tasks: '20',
  bounties: '2000',
  users: '5000',
};