import React from 'react'
import IssueCard from './issue-card'

export default {
  title: 'Design Library/Molecules/Cards/IssueCard',
  component: IssueCard,
}

const Template = (args) => <IssueCard {...args} />

export const Default = Template.bind({})
Default.args = {
  issue: {
    completed: true,
    data: {
      title: 'Sample Issue',
      description: 'This is a sample issue description.',
      status: 'open',
      updated_at: '2021-01-01',
      metadata: {
        issue: {
          user: {
            login: 'user',
            html_url: 'http://example.com',
          },
        },
      },
    },
  },
}
