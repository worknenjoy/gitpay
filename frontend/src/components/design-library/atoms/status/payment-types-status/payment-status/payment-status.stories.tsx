import React from 'react';

import PaymentStatus from './payment-status';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Status/Payments/PaymentStatus',
  component: PaymentStatus,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PaymentStatus {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  orderStatus: 'succeeded',
};

export const OpenStatus = Template.bind({});
OpenStatus.args = {
  orderStatus: 'open',
};

export const PendingStatus = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PendingStatus.args = {
  orderStatus: 'pending',
};

export const SucceededStatus = Template.bind({});
SucceededStatus.args = {
  orderStatus: 'succeeded',
};

export const FailedStatus = Template.bind({});
FailedStatus.args = {
  orderStatus: 'failed',
};

export const ExpiredStatus = Template.bind({});
ExpiredStatus.args = {
  orderStatus: 'expired',
};

export const CancelledStatus = Template.bind({});
CancelledStatus.args = {
  orderStatus: 'cancelled',
};

export const FailStatus = Template.bind({});
FailStatus.args = {
  orderStatus: 'fail',
};

export const CanceledStatus = Template.bind({});
CanceledStatus.args = {
  orderStatus: 'canceled',
};

export const RefundedStatus = Template.bind({});
RefundedStatus.args = {
  orderStatus: 'refunded',
};

export const UndefinedStatus = Template.bind({});
UndefinedStatus.args = {
  orderStatus: 'undefined',
};
