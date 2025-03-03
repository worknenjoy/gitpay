import React from 'react';

import InvoiceStatus from './invoice-status';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Status/Invoice Status',
  component: InvoiceStatus,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <InvoiceStatus {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  invoiceStatus: 'paid',
};

export const PendingStatus = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PendingStatus.args = {
  invoiceStatus: 'pending',
};

export const DraftStatus = Template.bind({});
DraftStatus.args = {
  invoiceStatus: 'draft',
};

export const OpenStatus = Template.bind({});
OpenStatus.args = {
  invoiceStatus: 'open',
};

export const PaidStatus = Template.bind({});
PaidStatus.args = {
  invoiceStatus: 'paid',
};

export const FailedStatus = Template.bind({});
FailedStatus.args = {
  invoiceStatus: 'failed',
};

export const UncollectibleStatus = Template.bind({});
UncollectibleStatus.args = {
  invoiceStatus: 'uncollectible',
};

export const VoidStatus = Template.bind({});
VoidStatus.args = {
  invoiceStatus: 'void',
};

export const RefundedStatus = Template.bind({});
RefundedStatus.args = {
  invoiceStatus: 'refunded',
};
