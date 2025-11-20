import React from 'react'
import IssueStatus from './issue-status'

export default {
  title: 'Design Library/Atoms/Status/IssueStatus',
  component: IssueStatus,
}

const Template = (args) => <IssueStatus {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  status: 'open',
}

export const Closed = Template.bind({})
Closed.args = {
  // Add default props here
  status: 'closed',
}
