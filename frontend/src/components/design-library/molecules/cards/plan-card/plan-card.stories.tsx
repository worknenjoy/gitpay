import React from 'react'

import PlanCard from './plan-card'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Molecules/Cards/PlanCard',
  component: PlanCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PlanCard {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  plan: {
    fee: 8,
    title: 'Plan Title',
    category: 'Category',
    price: 100,
    items: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
}
