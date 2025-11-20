import React from 'react'

import Drawer from './drawer'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Molecules/Drawers/Drawer',
  component: Drawer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Drawer {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  open: true,
  onClose: () => {},
  title: 'Drawer Title',
  children: 'Drawer Content',
  actions: [
    {
      label: 'Action 1',
      onClick: () => {},
      variant: 'contained',
      color: 'primary',
      disabled: false,
    },
    {
      label: 'Action 2',
      onClick: () => {},
      variant: 'contained',
      color: 'primary',
      disabled: true,
    },
  ],
}
