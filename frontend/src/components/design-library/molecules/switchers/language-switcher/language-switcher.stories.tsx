import React from 'react'
import LanguageSwitcher from './language-switcher'

export default {
  title: 'Design Library/Molecules/Switchers/LanguageSwitcher',
  component: LanguageSwitcher
}

const Template = (args) => <LanguageSwitcher {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  completed: true,
  onSwitchLang: () => {},
  userCurrentLanguage: 'en',
  user: {},
  variant: 'text',
  showLabel: false,
  showTooltip: true
}

export const OutlinedWithLabel = Template.bind({})
OutlinedWithLabel.args = {
  completed: true,
  onSwitchLang: () => {},
  userCurrentLanguage: 'en',
  user: {},
  variant: 'outlined',
  showLabel: true,
  showTooltip: false
}
