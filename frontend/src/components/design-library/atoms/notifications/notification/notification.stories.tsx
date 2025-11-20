import React from 'react'
import Notification from './notification'

export default {
  title: 'Design Library/Atoms/Notifications/Notification',
  component: Notification,
}

const Template = (args) => <Notification {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  message: 'This is a notification message',
  type: 'info',
}

export const Success = Template.bind({})
Success.args = {
  open: true,
  message: 'This is a success message',
  type: 'success',
}

export const Error = Template.bind({})
Error.args = {
  open: true,
  message: 'This is an error message',
  type: 'error',
}
