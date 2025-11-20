import React from 'react'

import Field from './field'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Inputs/Fields/Field',
  component: Field,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Field {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  name: 'name',
  label: 'Label',
  required: false,
  defaultValue: 'Default Value',
  value: 'Value',
  placeholder: 'Placeholder',
  disabled: false,
  help: false,
  completed: true,
  onChange: () => {},
}

export const Empty = Template.bind({})
Empty.args = {
  name: 'name',
  label: 'Label',
  required: false,
  defaultValue: '',
  value: '',
  placeholder: 'Placeholder',
  disabled: false,
  help: false,
  completed: true,
  onChange: () => {},
}

export const Loading = Template.bind({})
Loading.args = {
  completed: false,
}
