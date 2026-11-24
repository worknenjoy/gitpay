import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueOwnerCard from './issue-owner-card'

const meta: Meta<typeof IssueOwnerCard> = {
  title: 'Design Library/Molecules/Cards/IssueCards/IssueOwnerCard',
  component: IssueOwnerCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof IssueOwnerCard>

const reputation = { bountiesPaid: 128, totalPaid: '$24,310', openWithBounty: 6 }

export const VerifiedOrganization: Story = {
  args: {
    owner: { name: 'RetroShare', kind: 'Organization', since: 2019, verified: true, url: '#' },
    reputation
  }
}

export const User: Story = {
  args: {
    owner: { name: 'alexanmtz', kind: 'User', since: 2017 },
    reputation: { bountiesPaid: 3, totalPaid: '$420', openWithBounty: 1 }
  }
}

/** Without reputation data (today) the card isn't rendered. */
export const NoReputationData: Story = {
  args: { owner: { name: 'RetroShare', kind: 'Organization' } }
}

export const Loading: Story = {
  args: { ...VerifiedOrganization.args, completed: false }
}
