import React from 'react'
import IssueLabelsField from './issue-labels-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Issue/IssueLabelsField',
  component: IssueLabelsField
}

const Template = (args) => <IssueLabelsField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  issue: {
    Labels: [
      {
        id: 1,
        name: 'Label 1',
        color: 'red'
      },
      {
        id: 2,
        name: 'Label 2',
        color: 'blue'
      }
    ]
  }
}
