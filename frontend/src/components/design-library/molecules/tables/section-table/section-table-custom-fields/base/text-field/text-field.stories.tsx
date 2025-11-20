import React from 'react'
import TextField from './text-field'

export default {
  title: 'Design Library/Molecules/Tables/Base/TextField',
  component: TextField
}

const Template = (args) => <TextField {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Sample Text Field'
}
