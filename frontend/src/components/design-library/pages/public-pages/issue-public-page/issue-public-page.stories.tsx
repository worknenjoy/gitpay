import IssuePublicPage from './issue-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/Issue',
  component: IssuePublicPage,
  decorators: [withPublicTemplate],
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

/*
 * Arg helpers — plain props, exactly what the container passes to the page.
 * Values come from the "Gitpay Issue Page v2" design.
 */

const daysFromNow = (days: number) => new Date(Date.now() + days * 86400 * 1000).toISOString()

const importer = { id: 1, name: 'RetroShare', provider_username: 'RetroShare' }

const order = (id: number, amount: string, user: any, extra: any = {}) => ({
  id,
  amount,
  paid: true,
  status: 'succeeded',
  provider: 'stripe',
  source_type: 'card',
  createdAt: '2026-11-10T00:00:00.000Z',
  User: user,
  ...extra
})

const advanceOrders = [
  order(1, '200', { id: 7, name: 'worknenjoy' }),
  order(2, '100', { id: 8, name: 'defnax' }, { source_type: 'invoice-item', createdAt: '2026-11-14T00:00:00.000Z' }),
  order(3, '50', null, { createdAt: '2026-11-18T00:00:00.000Z' })
]

const description = `Todos: Feature to Edit Posts by Admin partly is done here
https://github.com/RetroShare/libretroshare/pull/224 & Gui

needs to use createpostV2 not all done void PostedCreatePostDialog::createPost()
https://github.com/RetroShare/RetroShare/pull/3094 Stick posts

feature (on top of the feed) (via context menu to stick) Maybe implement into Sorting to set on top? void PostedListWidgetWithModel::updateSorting(int s) For stick posts example for forums on libside here mPinnedPosts:`

const taskData = {
  id: 3094,
  provider: 'github',
  url: 'https://github.com/RetroShare/RetroShare/issues/3094',
  title: '[Qt] Boards improvements (alias Reddit clone)',
  description,
  state: 'funded',
  status: 'open',
  value: '350',
  level: 'intermediate',
  not_listed: false,
  private: false,
  deadline: daysFromNow(22),
  createdAt: daysFromNow(-30),
  User: importer,
  orders: advanceOrders,
  histories: [],
  Project: { id: 1, name: 'RetroShare', organization: { id: 1, name: 'RetroShare' } },
  metadata: {
    labels: [
      { id: 1, name: 'help wanted' },
      { id: 2, name: 'gui' },
      { id: 3, name: 'good first issue' }
    ],
    issue: {
      state: 'open',
      comments: 14,
      updated_at: daysFromNow(-3),
      html_url: 'https://github.com/RetroShare/RetroShare/issues/3094',
      user: { login: 'RetroShare', html_url: 'https://github.com/RetroShare' },
      assignees: [{ login: 'alexanmtz' }, { login: 'tbilous' }]
    }
  }
}

const withTask = (overrides: any = {}) => ({
  completed: true,
  data: { ...taskData, ...overrides },
  loading: false,
  error: null
})

const visitor = {
  logged: true,
  completed: true,
  data: { id: 2, name: 'alexanmtz', email: 'dev@example.com', Types: [{ id: 1, name: 'contributor' }] }
}

const issueOwner = {
  logged: true,
  completed: true,
  data: { id: 1, name: 'RetroShare', email: 'owner@example.com', Types: [{ id: 2, name: 'maintainer' }] }
}

const solutions = [
  {
    id: 1,
    author: { name: 'alexanmtz' },
    pullRequest: { number: 3102, title: 'Boards: stick posts to the top of the feed', url: 'https://github.com/RetroShare/RetroShare/pull/3102', state: 'merged' },
    sentAt: '2026-11-21',
    payout: 'ready'
  },
  {
    id: 2,
    author: { name: 'tbilous' },
    pullRequest: { number: 3098, title: 'Use createPostV2 in PostedCreatePostDialog', url: 'https://github.com/RetroShare/RetroShare/pull/3098', state: 'open' },
    sentAt: '2026-11-16',
    payout: 'waiting'
  }
]

const myPullRequests = [
  { repo: 'RetroShare/RetroShare', number: 3102, title: 'Boards: stick posts to the top of the feed', when: 'merged 2 days ago', state: 'merged', note: 'Mentions #3094' },
  { repo: 'RetroShare/RetroShare', number: 3090, title: 'Sort boards by pinned posts first', when: 'merged 1 week ago', state: 'merged' },
  { repo: 'RetroShare/RetroShare', number: 3098, title: 'Use createPostV2 in PostedCreatePostDialog', when: '1 week ago', state: 'open', note: 'Mentions #3094' },
  { repo: 'RetroShare/libretroshare', number: 231, title: 'Admin can edit posts in boards', when: '2 weeks ago', state: 'open' }
]

/** Everything the back end will add later — passed together to show the full design. */
const futureData = {
  solutions,
  follow: { following: false, followers: 24, onToggle: () => {} },
  owner: {
    profile: { name: 'RetroShare', kind: 'Organization', since: 2019, verified: true, url: '#' },
    reputation: { bountiesPaid: 128, totalPaid: '$24,310', openWithBounty: 6 }
  },
  linkedPullRequests: [
    { number: 3102, title: 'Boards: stick posts to the top of the feed', state: 'merged', url: 'https://github.com/RetroShare/RetroShare/pull/3102' },
    { number: 3098, title: 'Use createPostV2 in PostedCreatePostDialog', state: 'open', url: 'https://github.com/RetroShare/RetroShare/pull/3098' }
  ],
  myPullRequests,
  connectedAs: 'alexanmtz',
  onPledge: () => {},
  onRequestPayment: () => {},
  onPostOnGithub: () => {},
  messageTopics: ['Question about the issue', 'Ask to add a bounty', 'Working on it', 'Payment or payout', 'Other']
}

const actions = {
  onDeleteTask: () => Promise.resolve({}),
  updateTask: () => {},
  reportTask: () => {},
  messageAuthor: () => {},
  cleanPullRequestDataState: () => {},
  fetchAccount: () => Promise.resolve(),
  inviteTask: () => {},
  fundingInviteTask: () => {},
  getTaskSolution: () => {},
  createTaskSolution: () => Promise.resolve({}),
  updateTaskSolution: () => Promise.resolve({}),
  fetchPullRequestData: () => {},
  fetchCustomer: () => Promise.resolve(),
  addNotification: () => {},
  createOrder: () => Promise.resolve(),
  fetchWallet: () => Promise.resolve(),
  listWallets: () => Promise.resolve(),
  fetchTask: () => Promise.resolve(),
  syncTask: () => Promise.resolve()
}

const baseArgs = {
  ...actions,
  user: visitor,
  task: withTask(),
  account: { completed: false, data: {} },
  taskSolution: null,
  taskSolutionCompleted: true,
  pullRequestData: {},
  customer: { completed: true, data: { name: 'RetroShare e.V.' } },
  order: { completed: true, data: {} },
  wallet: { completed: true, data: { id: 1, name: 'RetroShare wallet', balance: 420 } },
  wallets: { completed: true, data: [{ id: 1, name: 'RetroShare wallet' }] },
  bottomBarProps: {},
  accountMenuProps: {}
}

const designArgs = { ...baseArgs, ...futureData }

/*
 * Today — what the live page renders with the data the back end sends now.
 */

export const TodayData = { args: baseArgs }

/*
 * Page states (design artboards)
 */

export const Funded = { args: designArgs }

export const PayLater = {
  args: {
    ...designArgs,
    task: withTask({
      state: 'created',
      value: '300',
      orders: [order(4, '300', importer, { paid: false, pledged: true, createdAt: '2026-10-28T00:00:00.000Z' })]
    })
  }
}

export const Flexible = {
  args: {
    ...designArgs,
    task: withTask({
      orders: [
        advanceOrders[0],
        order(5, '100', { id: 8, name: 'defnax' }, { paid: false, pledged: true }),
        order(6, '50', null, { paid: false, pledged: true })
      ]
    })
  }
}

export const ImportedByNonAuthor = {
  args: {
    ...designArgs,
    task: withTask({
      metadata: {
        ...taskData.metadata,
        issue: { ...taskData.metadata.issue, user: { login: 'defnax', html_url: 'https://github.com/defnax' } }
      }
    })
  }
}

export const NoBounty = {
  args: {
    ...designArgs,
    solutions: [],
    task: withTask({ state: 'created', value: '0', orders: [], deadline: null })
  }
}

export const VisibilityMenuOpen = {
  args: { ...designArgs, user: issueOwner, defaultVisibilityOpen: true }
}

/*
 * Actions (design artboards)
 */

export const AddBountyCard = { args: { ...designArgs, initialDialog: 'bounty' } }

export const AddBountyPayNow = {
  args: { ...Flexible.args, initialDialog: 'bounty', initialBountyWhen: 'now' }
}

export const AddBountyPayLater = {
  args: { ...Flexible.args, initialDialog: 'bounty', initialBountyWhen: 'later' }
}

export const AddBountyInvoice = {
  args: { ...designArgs, initialDialog: 'bounty', initialBountyMethod: 'invoice' }
}

export const AddBountyWallet = {
  args: { ...designArgs, initialDialog: 'bounty', initialBountyMethod: 'wallet' }
}

export const AddBountyWalletInsufficient = {
  args: {
    ...designArgs,
    initialDialog: 'bounty',
    initialBountyMethod: 'wallet',
    wallets: { completed: true, data: [{ id: 2, name: 'Personal wallet' }] },
    wallet: { completed: true, data: { id: 2, name: 'Personal wallet', balance: 35 } }
  }
}

export const BountyBreakdownFlexible = {
  args: { ...Flexible.args, initialDialog: 'breakdown' }
}

export const SolutionsSent = { args: { ...designArgs, initialDialog: 'solutions' } }

export const SendSolutionNotConnected = {
  args: {
    ...designArgs,
    connectedAs: undefined,
    myPullRequests: undefined,
    onConnectGithub: () => {},
    initialDialog: 'solution'
  }
}

export const SendSolutionPickingPullRequests = {
  args: { ...NoBounty.args, initialDialog: 'solution' }
}

export const MessageImporter = { args: { ...designArgs, initialDialog: 'message' } }

/*
 * Extra states
 */

export const Loading = {
  args: { ...baseArgs, task: { completed: false, data: null, loading: true, error: null } }
}

export const LoggedOut = {
  args: { ...baseArgs, user: { logged: false, completed: true, data: {} } }
}

export const LoggedOutMessage = {
  args: { ...LoggedOut.args, initialDialog: 'message' }
}

export const PrivateRepo = {
  args: { ...baseArgs, task: withTask({ private: true }) }
}

export const NoSolutions = {
  args: { ...designArgs, solutions: [], initialDialog: 'solutions' }
}

export const AnonymousSponsor = {
  args: {
    ...designArgs,
    task: withTask({ value: '50', orders: [order(3, '50', null)] })
  }
}

export const PaidOut = {
  args: { ...baseArgs, task: withTask({ paid: true, transfer_id: 'tr_1', state: 'completed' }) }
}
