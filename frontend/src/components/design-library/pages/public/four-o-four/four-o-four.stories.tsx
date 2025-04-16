import React from 'react';
import FourOFour from './four-o-four';

export default {
  title: 'Design Library/Pages/Public/FourOFour',
  component: FourOFour,
};

const Template = (args) => <FourOFour {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here if any
};