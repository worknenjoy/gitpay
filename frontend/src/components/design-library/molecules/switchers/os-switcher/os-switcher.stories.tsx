import React from 'react'
import OsSwitcher from './os-switcher'

export default {
  title: 'Design Library/Molecules/Switchers/OsSwitcher',
  component: OsSwitcher
}

const Template = (args) => <OsSwitcher {...args} />

export const Default = Template.bind({})
Default.args = {
  value: 'Windows',
  onChange: () => {},
  size: 'medium',
  allowEmpty: false
}

export const Multiple = Template.bind({})
Multiple.args = {
  multiple: true,
  value: ['Windows', 'Linux'],
  onChange: () => {},
  size: 'medium'
}
