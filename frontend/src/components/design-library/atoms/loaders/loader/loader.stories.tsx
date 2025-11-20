import React from 'react'
import Loader from './loader'

export default {
  title: 'Design Library/Atoms/Loaders/Loader',
  component: Loader,
}

const Template = (args) => <Loader {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here if any
}
