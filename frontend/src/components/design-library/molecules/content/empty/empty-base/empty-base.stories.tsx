import React from 'react';
import EmptyBase from './empty-base';
import { AccessAlarm as AlarmIcon } from '@mui/icons-material'; // you can replace this icon

export default {
  title: 'Design Library/Molecules/Empty/EmptyBase',
  component: EmptyBase
};

const Template = (args) => <EmptyBase {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'No data available',
  actionText: 'Add Data',
  onActionClick: () => alert('Action clicked!'),
  icon: <AlarmIcon />
}