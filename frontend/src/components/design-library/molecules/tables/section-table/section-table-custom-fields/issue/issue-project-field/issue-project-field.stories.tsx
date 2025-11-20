import React from 'react'
import IssueProjectField from './issue-project-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Issue/Issue Project Field',
  component: IssueProjectField,
}

const Template = (args) => <IssueProjectField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  issue: {
    Project: {
      id: 1,
      name: 'Project Name',
      OrganizationId: 1,
    },
  },
}
