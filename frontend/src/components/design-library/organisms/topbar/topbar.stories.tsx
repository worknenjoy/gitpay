import React from 'react';
import Topbar from './topbar';

export default {
  title: 'Design Library/Organisms/Topbar',
  component: Topbar,
};

const Template = (args) => <Topbar {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
};