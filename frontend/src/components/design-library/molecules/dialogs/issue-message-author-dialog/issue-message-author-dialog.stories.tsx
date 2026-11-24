import React from 'react'
import IssueMessageAuthorDiialog from './issue-message-author-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/IssueMessageAuthor',
  component: IssueMessageAuthorDiialog
}

const Template = (args) => <IssueMessageAuthorDiialog {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  userId: '123',
  taskId: '456',
  name: 'John Doe',
  onClose: () => console.error('Dialog closed'),
  onSend: (userId, taskId, message) =>
    console.error(`Message sent to user ${userId} for task ${taskId}: ${message}`)
}

/** Message the importer — with a recipient note (today). */
export const MessageImporter = Template.bind({})
MessageImporter.args = {
  ...Default.args,
  name: 'RetroShare',
  recipientNote: 'Imported this issue'
}

/** With topics, when topic support is available. */
export const WithTopics = Template.bind({})
WithTopics.args = {
  ...MessageImporter.args,
  topics: [
    'Question about the issue',
    'Ask to add a bounty',
    'Working on it',
    'Payment or payout',
    'Other'
  ]
}
