import React from 'react';
import { Breadcrumb } from './breadcrumb';

export default {
  title: 'Design Library/Molecules/Breadcrumbs/Breadcrumb',
  component: Breadcrumb,
};

const Template = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    { label: 'Home', href: '/' },
    { label: 'Library', href: '/library' },
    { label: 'Data', href: '/library/data' },
  ],
};