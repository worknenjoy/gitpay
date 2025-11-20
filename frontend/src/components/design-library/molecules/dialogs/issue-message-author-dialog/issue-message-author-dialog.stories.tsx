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
  onClose: () => console.log('Dialog closed'),
  onSend: (userId, taskId, message) =>
    console.log(`Message sent to user ${userId} for task ${taskId}: ${message}`)
}
