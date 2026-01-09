import React from 'react'
import ConfirmButton from './confirm-button'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Design Library/Atoms/Buttons/ConfirmButton',
  component: ConfirmButton,
  parameters: { layout: 'centered' }
}

const Template = (args) => <ConfirmButton {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Delete',
  color: 'error',
  variant: 'contained',
  completed: true,
  dialogMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  alertMessage: 'This will permanently remove the item.',
  alertSeverity: 'warning'
}

export const SecondaryStyle = Template.bind({})
SecondaryStyle.args = {
  label: 'Archive',
  color: 'secondary',
  variant: 'outlined',
  completed: true,
  dialogMessage: 'Archive this record? You can unarchive later in settings.',
  confirmLabel: 'Archive',
  cancelLabel: 'Keep'
}

export const WithConfirmFields = Template.bind({})
WithConfirmFields.args = {
  label: 'Delete',
  color: 'error',
  variant: 'contained',
  completed: true,
  dialogMessage: 'Please type DELETE to confirm the action.',
  confirmFields:  {
    name: 'confirmationInput',
    confirmName: 'confirmInput',
    label: 'Type DELETE to confirm:',
    confirmLabel: 'DELETE',
    type: 'text'
  },
  onConfirm: (e, confirmFields) => {
    console.log('Confirmed with fields:', confirmFields)
    action('Confirmed')(e, confirmFields)
  },
  alertMessage: 'This will permanently remove the item.',
  alertSeverity: 'warning'
}

export const Loading = Template.bind({})
Loading.args = {
  label: 'Delete',
  color: 'error',
  variant: 'contained',
  completed: false,
  dialogMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  alertMessage: 'This will permanently remove the item.',
  alertSeverity: 'warning'
}
