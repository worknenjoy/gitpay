import React from 'react'
import BaseStatus from './base-status'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Status/BaseStatus',
  component: BaseStatus
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <BaseStatus {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  status: 'active',
  statusList: [
    { status: 'active', color: 'green', label: 'Active' },
    { status: 'pending', color: 'yellow', label: 'Pending' },
    { status: 'unknown', color: 'gray', label: 'Unknown' },
    { status: 'inactive', color: 'red' }
  ],
  classes: {
    green: { backgroundColor: 'green' }
  },
  completed: true
}

export const Loading = Template.bind({})
Loading.args = {
  status: 'loading',
  statusList: [{ status: 'loading', color: 'blue', label: 'Loading' }],
  classes: {
    blue: { backgroundColor: 'blue' }
  },
  completed: false
}
