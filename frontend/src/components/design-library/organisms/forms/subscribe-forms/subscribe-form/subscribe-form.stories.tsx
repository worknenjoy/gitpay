import React from 'react'
import SubscribeForm from './subscribe-form'

export default {
  title: 'Design Library/Organisms/Forms/SubscribeForms/SubscribeForm',
  component: SubscribeForm
}

const Template = (args) => <SubscribeForm {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here if any
  render: true,
  type: 'subscribe-form'
}
