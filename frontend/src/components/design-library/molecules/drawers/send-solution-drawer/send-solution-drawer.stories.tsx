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
