import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TaskDeadlineDrawer from './task-deadline-drawer';

const meta: Meta = {
  title: 'Design Library/Molecules/Drawers/TaskDeadlineDrawer',
  component: TaskDeadlineDrawer as any,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onClose: { action: 'onClose' },
    onSave: { action: 'onSave' },
    onChange: { action: 'onChange' },
  },
};

export default meta;

type Story = StoryObj<any>;

export const Default: Story = {
  args: {
    open: true,
    // Provide a sample deadline if the component accepts one
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  render: (args) => {
    const [open, setOpen] = React.useState<boolean>(!!args.open);

    const handleClose = () => {
      setOpen(false);
      if (typeof args.onClose === 'function') args.onClose();
    };

    const Component = TaskDeadlineDrawer as any;

    return (
      <div style={{ padding: 16 }}>
        <button onClick={() => setOpen(true)}>Open Task Deadline Drawer</button>
        <Component
          {...args}
          open={open}
          isOpen={open}
          onClose={handleClose}
          onRequestClose={handleClose}
        />
      </div>
    );
  },
};