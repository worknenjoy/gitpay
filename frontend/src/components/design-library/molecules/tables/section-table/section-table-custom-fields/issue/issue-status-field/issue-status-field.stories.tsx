import React from 'react'
import IssueStatusField from './issue-status-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Issue/IssueStatusField',
  component: IssueStatusField
}

const Template = (args) => <IssueStatusField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  issue: {
    status: 'open'
  }
}

export const Closed = Template.bind({})
Closed.args = {
  // Add default props here
  issue: {
    status: 'closed'
  }
}
