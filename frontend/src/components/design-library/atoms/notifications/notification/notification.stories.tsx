import React from 'react'
import Notification from './notification'

export default {
  title: 'Design Library/Atoms/Notifications/Notification',
  component: Notification
}

const Template = (args) => <Notification {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  message: 'This is a notification message'
}

export const Success = Template.bind({})
Success.args = {
  open: true,
  message: 'This is a success message',
  severity: 'success'
}

export const Error = Template.bind({})
Error.args = {
  open: true,
  message: 'This is an error message',
  type: 'error',
  severity: 'error'
}

export const WithLink = Template.bind({})
WithLink.args = {
  open: true,
  message: 'This is a notification with a link',
  link: 'https://example.com',
  linkLabel: 'Click here'
}

export const Warning = Template.bind({})
Warning.args = {
  open: true,
  message: 'This is a warning message',
  severity: 'warning'
}

export const Info = Template.bind({})
Info.args = {
  open: true,
  message: 'This is an info message',
  severity: 'info'
}

export const TopPersistentWarning = Template.bind({})
TopPersistentWarning.args = {
  open: true,
  message: 'This is a persistent warning that does not auto-hide.',
  severity: 'warning',
  title: 'Important Notice',
  position: 'top',
  persistent: true
}

export const StickyFullWidth = Template.bind({})
StickyFullWidth.args = {
  open: true,
  message: 'This is a sticky full-width warning banner.',
  severity: 'warning',
  title: 'Important Notice',
  sticky: true,
  fullWidth: true
}
