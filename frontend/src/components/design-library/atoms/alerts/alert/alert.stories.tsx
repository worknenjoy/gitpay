import React from 'react'

import Alert from './alert'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Alerts/Alert',
  component: Alert
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Alert {...args} />

export const InfoAlertExample = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InfoAlertExample.args = {
  severity: 'info',
  children: 'Please make sure you have bank account on the country selected before continue.',
  completed: true
}

export const WarningAlertExample = Template.bind({})
WarningAlertExample.args = {
  severity: 'warning',
  children: 'Please make sure you have bank account on the country selected before continue.',
  completed: true
}
export const ErrorAlertExample = Template.bind({})
ErrorAlertExample.args = {
  severity: 'error',
  children: 'Please make sure you have bank account on the country selected before continue.',
  completed: true
}
export const SuccessAlertExample = Template.bind({})
SuccessAlertExample.args = {
  severity: 'success',
  children: 'Please make sure you have bank account on the country selected before continue.',
  completed: true
}

export const LoadingAlertExample = Template.bind({})
LoadingAlertExample.args = {
  severity: 'info',
  children: 'Please make sure you have bank account on the country selected before continue.',
  completed: false
}
