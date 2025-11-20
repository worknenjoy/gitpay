import React from 'react'
import CheckboxTerms from './checkbox-terms'

export default {
  title: 'Design Library/Atoms/inputs/CheckboxTerms',
  component: CheckboxTerms,
}

const Template = (args) => <CheckboxTerms {...args} />

export const Default = Template.bind({})
Default.args = {
  onchange: () => {},
  onAccept: () => {},
}
