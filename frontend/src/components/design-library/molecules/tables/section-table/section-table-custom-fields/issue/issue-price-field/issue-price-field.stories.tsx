import React from 'react'
import IssuePriceField from './issue-price-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Issue/IssuePriceField',
  component: IssuePriceField,
}

const Template = (args) => <IssuePriceField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  issue: {
    value: 100,
  },
}
