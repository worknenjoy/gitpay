import React from 'react'
import Introduction from './introduction'

export default {
  title: 'Design Library/Molecules/Content/Introduction',
  component: Introduction,
}

const Template = (args) => <Introduction {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Introduction',
  image: 'https://via.placeholder',
  children: 'This is the introduction text',
}
