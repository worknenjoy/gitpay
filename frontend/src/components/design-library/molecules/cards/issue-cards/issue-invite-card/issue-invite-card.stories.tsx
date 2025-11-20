import React from 'react'
import IssueInviteCard from './issue-invite-card'

const meta = {
  title: 'Design Library/Molecules/Cards/IssueInviteCard',
  component: IssueInviteCard,
  args: {}
}

const Template = (args) => <IssueInviteCard {...args} />

export default meta

export const Default = Template.bind({})
Default.args = {
  user: {
    completed: true,
    data: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  id: 1,
  onInvite: () => {
    console.log('Invite')
  },
  onFunding: () => {
    console.log('Funding')
  }
}

export const Loading = Template.bind({})
Loading.args = {
  use: {
    completed: false
  }
}
