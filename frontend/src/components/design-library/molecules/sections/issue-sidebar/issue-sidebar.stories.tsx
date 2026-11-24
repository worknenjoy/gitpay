import React from 'react'
import IssueSidebar from './issue-sidebar'

export default {
  title: 'Design Library/Molecules/Sections/IssueSidebar',
  component: IssueSidebar,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    )
  ]
}

const Template = (args) => <IssueSidebar {...args} />

const daysFromNow = (days: number) => new Date(Date.now() + days * 86400 * 1000).toISOString()

const orders = [
  { id: 1, amount: '200', paid: true, provider: 'stripe', source_type: 'card', createdAt: '2026-11-10', User: { id: 7, name: 'worknenjoy' } },
  { id: 2, amount: '100', paid: true, provider: 'stripe', source_type: 'invoice-item', createdAt: '2026-11-14', User: { id: 8, name: 'defnax' } },
  { id: 3, amount: '50', paid: true, provider: 'wallet', source_type: 'wallet-funds', createdAt: '2026-11-18', User: null }
]

const taskData = {
  id: 3094,
  provider: 'github',
  url: 'https://github.com/RetroShare/RetroShare/issues/3094',
  title: '[Qt] Boards improvements (alias Reddit clone)',
  state: 'funded',
  status: 'open',
  value: '350',
  level: 'intermediate',
  not_listed: false,
  private: false,
  deadline: daysFromNow(22),
  User: { id: 1, name: 'RetroShare', provider_username: 'RetroShare' },
  orders,
  metadata: {
    issue: {
      state: 'open',
      comments: 14,
      updated_at: daysFromNow(-3),
      html_url: 'https://github.com/RetroShare/RetroShare/issues/3094',
      user: { login: 'defnax' },
      assignees: [{ login: 'alexanmtz' }, { login: 'tbilous' }]
    }
  }
}

const baseArgs = {
  user: { completed: true, data: { id: 2, name: 'alexanmtz' } },
  task: { completed: true, data: taskData },
  updateTask: () => {},
  inviteTask: () => {},
  fundingInviteTask: () => {},
  onAddBounty: () => {},
  onSendSolution: () => {},
  onBreakdown: () => {},
  onSolutions: () => {}
}

/** What the live page renders with today's data. */
export const TodayData = Template.bind({})
TodayData.args = baseArgs

/** Every section on, as designed. */
export const FullDesign = Template.bind({})
FullDesign.args = {
  ...baseArgs,
  solutionsCount: 2,
  follow: { following: false, followers: 24, onToggle: () => {} },
  owner: {
    profile: { name: 'RetroShare', kind: 'Organization', since: 2019, verified: true },
    reputation: { bountiesPaid: 128, totalPaid: '$24,310', openWithBounty: 6 }
  },
  linkedPullRequests: [
    { number: 3102, title: 'Boards: stick posts to the top of the feed', state: 'merged', url: 'https://github.com/RetroShare/RetroShare/pull/3102' },
    { number: 3098, title: 'Use createPostV2 in PostedCreatePostDialog', state: 'open', url: 'https://github.com/RetroShare/RetroShare/pull/3098' }
  ],
  onPostOnGithub: () => {}
}

/** The issue owner sees the visibility menu, deadline and level pickers. */
export const Owner = Template.bind({})
Owner.args = { ...baseArgs, user: { completed: true, data: { id: 1, name: 'RetroShare' } } }

export const NoBounty = Template.bind({})
NoBounty.args = {
  ...baseArgs,
  task: { completed: true, data: { ...taskData, state: 'created', value: '0', orders: [], deadline: null } }
}

export const PaidOut = Template.bind({})
PaidOut.args = {
  ...baseArgs,
  task: { completed: true, data: { ...taskData, paid: true, transfer_id: 'tr_1' } }
}

export const Loading = Template.bind({})
Loading.args = { ...baseArgs, task: { completed: false, data: null } }
