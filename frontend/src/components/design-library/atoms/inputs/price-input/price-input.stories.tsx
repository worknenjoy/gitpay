import React from 'react'

import PriceInput from './price-input'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Inputs/Price Input',
  component: PriceInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PriceInput {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  priceLabel: 'Price',
  value: 0,
  onChange: () => {},
  defaultValue: 0,
  currency: '$',
}
