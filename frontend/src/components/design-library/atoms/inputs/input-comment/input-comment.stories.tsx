import React from 'react'
import InputComment from './input-comment'

export default {
  title: 'Design Library/Atoms/Inputs/InputComment',
  component: InputComment
}

const Template = (args) => <InputComment {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Write a comment...',
  value: ''
}
