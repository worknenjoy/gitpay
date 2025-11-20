import React from 'react'

import InvoicePayment from './invoice-payment'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Organisms/Forms/InvoiceForms/InvoicePayment',
  component: InvoicePayment,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <InvoicePayment {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  price: 20,
  customer: {
    data: {
      name: 'Customer Name',
      address: {
        line1: 'Address Line 1',
        line2: 'Address Line 2',
        city: 'City',
        state: 'State',
        postal_code: 'Postal Code',
        country: 'Country',
      },
    },
    completed: true,
  },
  onInfoClick: () => {},
  onInvoicePayment: () => {},
}

export const Loading = Template.bind({})
Loading.args = {
  price: 20,
  customer: {
    data: {},
    completed: false,
  },
  onInfoClick: () => {},
  onInvoicePayment: () => {},
}
