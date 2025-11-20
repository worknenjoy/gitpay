import React from 'react'
import Checkboxes from './checkboxes'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Design Library/Atoms/Inputs/Checkboxes',
  component: Checkboxes
}

const Template = (args) => <Checkboxes {...args} />

export const Default = Template.bind({})
Default.args = {
  completed: true,
  checkboxes: [
    { label: 'Option 1', name: 'option1', value: 'value1' },
    { label: 'Option 2', name: 'option2', value: 'value2' }
  ]
}

export const WithSelectAll = Template.bind({})
WithSelectAll.args = {
  completed: true,
  checkboxes: [
    { label: 'Option 1', name: 'option1', value: 'option1' },
    { label: 'Option 2', name: 'option2', value: 'option2' },
    { label: 'Option 3', name: 'option3', value: 'option3' }
  ],
  includeSelectAll: true
}

export const WithOnChange = Template.bind({})
WithOnChange.args = {
  completed: true,
  checkboxes: [
    { label: 'Option 1', name: 'option1', value: 'option1' },
    { label: 'Option 2', name: 'option2', value: 'option2' },
    { label: 'Option 3', name: 'option3', value: 'option3' }
  ],
  onChange: (selected) => {
    action('Selected Checkboxes')(selected)
  }
}

export const Loading = Template.bind({})
Loading.args = {
  checkboxes: [],
  completed: false
}
