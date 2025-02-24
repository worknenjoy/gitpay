import React from 'react';
import ImportIssue from './import-issue';
import { on } from 'events';

export default {
  title: 'Design Library/Organisms/ImportIssue',
  component: ImportIssue,
};

const Template = (args) => <ImportIssue {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  onImport: () => {}
};