import React from 'react'
import TopbarMenu from './topbar-menu'

export default {
  title: 'Design Library/Molecules/Menus/TopbarMenu',
  component: TopbarMenu,
}

const Template = (args) => <TopbarMenu {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
}
