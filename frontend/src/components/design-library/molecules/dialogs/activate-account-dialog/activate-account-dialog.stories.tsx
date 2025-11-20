import React from 'react'
import ActivateAccountDialog from './activate-account-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/ActivateAccountDialog',
  component: ActivateAccountDialog,
  argTypes: {
    onClose: { action: 'closed' },
    onActivate: { action: 'activated' },
  },
}

const Template = (args) => <ActivateAccountDialog {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  onClose: () => {},
  onResend: () => {},
  completed: true,
}

export const Loading = Template.bind({})
Loading.args = {
  open: true,
  onClose: () => {},
  onResend: () => {},
  completed: false,
}
