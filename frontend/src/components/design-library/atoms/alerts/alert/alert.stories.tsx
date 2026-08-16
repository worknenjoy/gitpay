import React from 'react'
import Button from '../../../atoms/buttons/button/button'

import Alert from './alert'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'

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

export const AlertWithActionExample = Template.bind({})
AlertWithActionExample.args = {
  severity: 'warning',
  children: (
  <>
    <Typography variant="subtitle2">
    <FormattedMessage
      id="payout-settings.whop.banner.rejected.title"
      defaultMessage="Action needed on Whop"
    />
  </Typography>
  <Typography variant="body2">
    <FormattedMessage
      id="payout-settings.whop.banner.rejected.description"
      defaultMessage="Whop flagged an issue with this account. Open Whop to resolve it before payouts can continue."
    />
  </Typography>
  </>),
  completed: true,
  action: <Button variant="outlined" size="small">
    Click me
  </Button>
}

export const LoadingAlertExample = Template.bind({})
LoadingAlertExample.args = {
  severity: 'info',
  children: 'Please make sure you have bank account on the country selected before continue. More text for two lines of content.',
  completed: false
}
