import type { Meta, StoryObj } from '@storybook/react'
import ConfirmDialog from './confirm-dialog'

const meta = {
  title: 'Design Library/Molecules/Dialogs/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  argTypes: {},
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof ConfirmDialog>

export const DefaultOpen: Story = {
  args: {
    open: true,
    title: 'Delete item?',
    message: 'This action cannot be undone. Are you sure you want to proceed?',
    alertMessage: 'Please confirm your action.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    completed: true,
  },
}

export const LongContent: Story = {
  args: {
    open: true,
    title: 'Archive project?',
    message:
      'Archiving will hide this project from active views and prevent new activity. You can unarchive it at any time from the settings page. Please confirm that you want to continue with this operation.',
    confirmLabel: 'Archive',
    cancelLabel: 'Keep Active',
  },
}

export const WithoutTitle: Story = {
  args: {
    open: true,
    children: 'Proceed with this action?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
}

export const Loading: Story = {
  args: {
    open: true,
    message: 'Loading...',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    completed: false,
  },
}
