import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import ImportIssueDialog from './import-issue-dialog';
import { on } from 'events';

export default {
  title: 'Design Library/Molecules/ImportIssueDialog',
  component: ImportIssueDialog,
} as Meta;

const Template: Story = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Import Issue Dialog</button>
      <ImportIssueDialog {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  // Add default args here if needed
  onImport: () => {},
};