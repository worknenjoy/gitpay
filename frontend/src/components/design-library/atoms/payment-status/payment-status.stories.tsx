import React from 'react';

import PaymentStatus from './payment-status';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Payment Status',
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
