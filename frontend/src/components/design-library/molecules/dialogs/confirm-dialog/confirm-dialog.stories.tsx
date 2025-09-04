import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from './confirm-dialog';

const meta = {
  title: 'Design Library/Molecules/Dialogs/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  argTypes: {
    onConfirm: { action: 'confirm' },
    onCancel: { action: 'cancel' },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const DefaultOpen: Story = {
  args: {
    open: true,
    title: 'Delete item?',
    message: 'This action cannot be undone. Are you sure you want to proceed?',
    alertMessage: 'Please confirm your action.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  },
};

export const LongContent: Story = {
  args: {
    open: true,
    title: 'Archive project?',
    message:
      'Archiving will hide this project from active views and prevent new activity. You can unarchive it at any time from the settings page. Please confirm that you want to continue with this operation.',
    confirmLabel: 'Archive',
    cancelLabel: 'Keep Active',
  },
};

export const WithoutTitle: Story = {
  args: {
    open: true,
    children: 'Proceed with this action?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
};

export const WithTrigger: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setOpen(true)}>Open Confirm Dialog</button>
        <ConfirmDialog
          {...args}
          open={open}
          onCancel={() => {
            setOpen(false);
            args.onCancel?.();
          }}
          onConfirm={() => {
            setOpen(false);
            args.onConfirm?.();
          }}
          title={args.title ?? 'Perform action?'}
        >
          {args.children ?? 'Are you sure you want to do this?'}
        </ConfirmDialog>
      </div>
    );
  },
  args: {
    confirmLabel: 'Yes',
    cancelLabel: 'No',
  },
};