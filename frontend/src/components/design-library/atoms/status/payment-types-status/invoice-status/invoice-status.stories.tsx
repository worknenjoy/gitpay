import React from 'react';

import InvoiceStatus from './invoice-status';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Status/Payments/Invoice Status',
  component: InvoiceStatus,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <InvoiceStatus {...args} />;



export const Pending= Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Pending.args = {
  status: 'pending',
};

export const Draft= Template.bind({});
Draft.args = {
  status: 'draft',
};

export const Open= Template.bind({});
Open.args = {
  status: 'open',
};

export const Paid= Template.bind({});
Paid.args = {
  status: 'paid',
};

export const Failed= Template.bind({});
Failed.args = {
  status: 'failed',
};

export const Uncollectible= Template.bind({});
Uncollectible.args = {
  status: 'uncollectible',
};

export const Void= Template.bind({});
Void.args = {
  status: 'void',
};

export const Refunded= Template.bind({});
Refunded.args = {
  status: 'refunded',
};
