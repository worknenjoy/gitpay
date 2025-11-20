import React from 'react'
import BaseTabs from './base-tabs'

export default {
  title: 'Design Library/Molecules/Tabs/BaseTabs',
  component: BaseTabs,
}

const Template = (args) => <BaseTabs {...args} />

export const Default = Template.bind({})
Default.args = {
  activeTab: 1,
  tabs: [
    { value: 1, label: 'Tab 1' },
    { value: 2, label: 'Tab 2' },
    { value: 3, label: 'Tab 3' },
  ],
  children: <div>Account Tabs Content</div>,
}

export const VerticalTabs = Template.bind({})
VerticalTabs.args = {
  activeTab: 1,
  tabs: [
    { value: 1, label: 'Tab 1' },
    { value: 2, label: 'Tab 2' },
    { value: 3, label: 'Tab 3' },
  ],
  children: <div>Account Tabs Content</div>,
  orientation: 'vertical',
}
