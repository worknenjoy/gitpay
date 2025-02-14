import React from 'react';
import { Meta, Story } from '@storybook/react';
import Bottom from './bottom';

export default {
  title: 'Design Library/Organisms/Bottom',
  component: Bottom,
} as Meta;

const Template: Story = (args) => <Bottom {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
};