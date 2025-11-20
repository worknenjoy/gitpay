import React from 'react'
import CreatedField from './created-field'

export default {
  title: 'Design Library/Molecules/Tables/Base/CreatedField',
  component: CreatedField,
}

const Template = (args) => <CreatedField {...args} />

export const Default = Template.bind({})
Default.args = {
  createdAt: '2023-10-01T12:00:00Z',
}
