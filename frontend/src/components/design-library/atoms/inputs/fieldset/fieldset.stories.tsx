import React from 'react'
import Fieldset from './fieldset'
import Field from '../fields/field/field'

export default {
  title: 'Design Library/Atoms/Inputs/Fieldset',
  component: Fieldset,
  argTypes: {
    legend: { control: 'text' },
    children: { control: 'text' }
  }
}

const Template = (args) => <Fieldset {...args} />

export const Default = Template.bind({})
Default.args = {
  legend: 'Custom Fieldset',
  completed: true,
  children: (
    <Field
      name="custom-field"
      label="Custom Field"
      placeholder="Enter text"
      value=""
      onChange={() => {}}
      type="text"
      disabled={false}
      required={false}
    />
  )
}

export const Loading = Template.bind({})
Loading.args = {
  legend: 'Loading Fieldset',
  completed: false,
  children: <></>
}
