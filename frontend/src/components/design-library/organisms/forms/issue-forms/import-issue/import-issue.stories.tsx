import React from 'react'
import ImportIssue from './import-issue'

export default {
  title: 'Design Library/Organisms/Forms/IssueForms/ImportIssue',
  component: ImportIssue
}

const Template = (args) => <ImportIssue {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  onImport: () => {}
}
