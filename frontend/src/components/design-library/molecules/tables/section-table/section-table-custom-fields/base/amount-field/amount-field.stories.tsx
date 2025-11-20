import React from 'react'
import AmountField from './amount-field'

export default {
  title: 'Design Library/Molecules/Tables/Base/AmountField',
  component: AmountField
}

const Template = (args) => <AmountField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  value: 1000
}
