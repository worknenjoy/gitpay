import React from 'react'
import IssueReportsDialog from './issue-reports-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/IssueReportsDialog',
  component: IssueReportsDialog
}

const Template = (args) => <IssueReportsDialog {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  onClose: () => console.log('Dialog closed'),
  issueDetails: {
    title: 'Sample Issue',
    description: 'This is a sample issue description.'
  }
}
