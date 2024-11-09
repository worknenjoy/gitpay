import React from 'react';
import { Meta } from '@storybook/react';
import Introduction from './introduction';

export default {
  title: 'Design Library/Molecules/Introduction',
  component: Introduction,
} as Meta;

const Template = (args) => <Introduction {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Introduction',
  image: 'https://via.placeholder',
  children: 'This is the introduction text',
};

