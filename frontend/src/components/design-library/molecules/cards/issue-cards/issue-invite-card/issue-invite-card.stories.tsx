import React from 'react'
import IssueInviteCard from './issue-invite-card'

const meta = {
  title: 'Design Library/Molecules/Cards/IssueInviteCard',
  component: IssueInviteCard,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    )
  ]
}

const Template = (args) => <IssueInviteCard {...args} />

export default meta

const baseArgs = {
  user: {
    completed: true,
    data: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  id: 1,
  onInvite: () => {},
  onFunding: () => {}
}

/** Today: invite contributor and invite sponsor. */
export const Default = Template.bind({})
Default.args = baseArgs

/** With the post-on-GitHub action available. */
export const WithPostOnGithub = Template.bind({})
WithPostOnGithub.args = { ...baseArgs, onPostOnGithub: () => {} }
