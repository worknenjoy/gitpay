import React from 'react';
import IssueCreatedField from './issue-created-field';

export default {
  title: 'Design Library/Molecules/SectionTable/Fields/IssueCreatedField',
  component: IssueCreatedField,
};

const Template = (args) => <IssueCreatedField {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  issue: {
    createdAt: '2021-07-01T00:00:00.000Z',
  },
};