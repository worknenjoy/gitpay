import React from 'react'

import SendSolutionDrawer from './send-solution-drawer'

export default {
  title: 'Design Library/Molecules/Drawers/SendSolutionDrawer',
  component: SendSolutionDrawer
}

const noop = () => {}
const asyncNoop = async () => {}
const asyncResolve = async (v?: any) => v ?? {}

const Template = (args) => <SendSolutionDrawer {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  onClose: noop,
  // drawer state controls
  assignDialog: false,

  // data needed by component
  user: {
    completed: true,
    data: { id: 1, account_id: 1, email: 'dev@example.com' }
  },
  account: {
    completed: true,
    data: { requirements: { currently_due: [] } }
  },
  task: {
    completed: true,
    data: {
      id: 101,
      value: '250',
      paid: false,
      transfer_id: null,
      Transfer: null
    }
  },
  pullRequestData: {
    isConnectedToGitHub: true,
    isAuthorOfPR: true,
    isPRMerged: true,
    isIssueClosed: true,
    hasIssueReference: true
  },
  taskSolution: {},
  taskSolutionCompleted: true,
  // effects and actions (mocked)
  fetchAccount: asyncNoop,
  getTaskSolution: asyncResolve,
  cleanPullRequestDataState: noop,
  fetchPullRequestData: asyncResolve,
  createTaskSolution: asyncResolve,
  updateTaskSolution: asyncResolve
}

export const WithExistingSolution = Template.bind({})
WithExistingSolution.args = {
  ...Default.args,
  taskSolution: {
    id: 555,
    pullRequestURL: 'https://github.com/org/repo/pull/123',
    status: 'submitted'
  }
}

const myPullRequests = [
  {
    repo: 'RetroShare/RetroShare',
    number: 3102,
    title: 'Boards: stick posts to the top of the feed',
    when: 'merged 2 days ago',
    state: 'merged' as const,
    note: 'Mentions #3094'
  },
  {
    repo: 'RetroShare/RetroShare',
    number: 3098,
    title: 'Use createPostV2 in PostedCreatePostDialog',
    when: '1 week ago',
    state: 'open' as const,
    note: 'Mentions #3094'
  },
  {
    repo: 'RetroShare/libretroshare',
    number: 231,
    title: 'Admin can edit posts in boards',
    when: '2 weeks ago',
    state: 'open' as const
  }
]

/** Nothing checked yet — the state right after opening the drawer today. */
export const TodayData = Template.bind({})
TodayData.args = { ...Default.args, pullRequestData: {} }

/** GitHub not connected — paste a URL or connect. */
export const NotConnected = Template.bind({})
NotConnected.args = { ...Default.args, pullRequestData: {}, onConnectGithub: noop }

/** Picking from the contributor's own pull requests. */
export const PickingPullRequests = Template.bind({})
PickingPullRequests.args = { ...Default.args, connectedAs: 'alexanmtz', myPullRequests }

/** No bounty yet: request payment from the maintainer. */
export const NoBountyRequestPayment = Template.bind({})
NoBountyRequestPayment.args = {
  ...Default.args,
  task: { completed: true, data: { id: 101, value: '0', paid: false } },
  pullRequestData: { ...Default.args.pullRequestData, isPRMerged: false },
  connectedAs: 'alexanmtz',
  myPullRequests,
  onRequestPayment: noop
}
