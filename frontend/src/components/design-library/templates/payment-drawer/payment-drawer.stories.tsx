import React from 'react';

import PaymentDrawer from './payment-drawer';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Templates/Payment Drawer',
  component: PaymentDrawer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PaymentDrawer {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  tabs: [
    {
      label: 'Tab 1',
      value: 'tab1',
      component: <div>Tab 1</div>,
      default: true
    },
    {
      label: 'Tab 2',
      value: 'tab2',
      component: <div>Tab 2</div>,
    },
  ],
  open: true,
  onClose: () => {},
  onChangePrice: () => {},
  title: 'Title',
  pickupTagListMessagesPrimaryText: 'Primary Text',
  pickupTagListMessagesSecondaryText: 'Secondary Text',
};
