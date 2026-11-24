/**
 * Pure helpers for the issue page. They read the plain `task` / `user` /
 * `pullRequestData` props the page already receives and derive what each
 * card, drawer and header piece shows. No Redux knowledge — just props in,
 * view data out. When a field is not available yet the helper returns
 * `undefined` / an empty list so the component can skip rendering it.
 */

export type PaymentMethod = 'card' | 'invoice' | 'wallet' | 'paypal'
export type BountyPaymentState = 'paid' | 'pledged' | 'pending'
export type PaymentTiming = 'advance' | 'later' | 'flex'
export type IssueVisibility = 'public' | 'unlisted'
export type ChecklistState = 'checked' | 'failed' | 'warning'

export type Person = {
  id?: number | string
  name: string
  avatarUrl?: string
  url?: string
}

export type Sponsor = Person & { anonymous?: boolean }

export type BountyPayment = {
  id: number | string
  sponsor: Sponsor
  amount: number
  method: PaymentMethod
  state: BountyPaymentState
  date?: string
}

export type BountySummary = {
  total: number
  sponsors: Sponsor[]
  payments: BountyPayment[]
}

export type GithubIssueInfo = {
  status: 'open' | 'closed'
  repoPrivate: boolean
  author?: Person
  assignees: Person[]
  comments?: number
  updatedAt?: string
  url?: string
}

export type DeadlineInfo = {
  date: string
  daysLeft: number
  overdue: boolean
}

export type BreakdownTotals = {
  paid: number
  pledged: number
  pending: number
  total: number
  count: number
}

const toNumber = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const personFromUser = (user: any): Person | undefined => {
  if (!user) return undefined
  const name = user.name || user.username || user.provider_username
  if (!name) return undefined
  return {
    id: user.id,
    name,
    avatarUrl: user.picture_url || user.profile_url || undefined,
    url: user.website || undefined
  }
}

const personFromGithub = (ghUser: any): Person | undefined => {
  if (!ghUser || !ghUser.login) return undefined
  return {
    id: ghUser.id,
    name: ghUser.login,
    avatarUrl: ghUser.avatar_url,
    url: ghUser.html_url
  }
}

export const getTaskOrders = (taskData: any): any[] =>
  (taskData?.orders || taskData?.Orders || []).filter(Boolean)

export const getPaymentMethod = (order: any): PaymentMethod => {
  const provider = String(order?.provider || '').toLowerCase()
  const sourceType = String(order?.source_type || '').toLowerCase()
  if (provider === 'paypal') return 'paypal'
  if (provider === 'wallet' || sourceType === 'wallet-funds' || sourceType === 'wallet') {
    return 'wallet'
  }
  if (sourceType === 'invoice-item' || sourceType === 'invoice') return 'invoice'
  return 'card'
}

export const getPaymentState = (order: any): BountyPaymentState => {
  if (order?.paid) return 'paid'
  if (order?.pledged || order?.timing === 'later') return 'pledged'
  return 'pending'
}

/**
 * Bounty total, sponsors and payment lines. Only paid orders and orders still
 * waiting on an invoice are listed — failed / canceled ones are not part of
 * the bounty.
 */
export const getBountySummary = (taskData: any): BountySummary => {
  const orders = getTaskOrders(taskData).filter(
    (order) =>
      order.paid ||
      (getPaymentMethod(order) === 'invoice' && (order.status === 'open' || !order.status)) ||
      order.pledged
  )

  const payments: BountyPayment[] = orders.map((order) => {
    const person = personFromUser(order.User)
    return {
      id: order.id,
      sponsor: person ? person : { name: 'Anonymous', anonymous: true },
      amount: toNumber(order.amount),
      method: getPaymentMethod(order),
      state: getPaymentState(order),
      date: order.createdAt || order.updatedAt
    }
  })

  const seen = new Set<string>()
  const sponsors: Sponsor[] = []
  payments.forEach(({ sponsor }) => {
    const key = sponsor.anonymous ? 'anonymous' : String(sponsor.id ?? sponsor.name)
    if (seen.has(key)) return
    seen.add(key)
    sponsors.push(sponsor)
  })

  const fromOrders = payments
    .filter((p) => p.state !== 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
  const total = Math.max(toNumber(taskData?.value), fromOrders)

  return { total, sponsors, payments }
}

export const getBreakdownTotals = (payments: BountyPayment[]): BreakdownTotals => {
  const sum = (state: BountyPaymentState) =>
    payments.filter((p) => p.state === state).reduce((total, p) => total + p.amount, 0)
  const paid = sum('paid')
  const pledged = sum('pledged')
  const pending = sum('pending')
  return { paid, pledged, pending, total: paid + pledged, count: payments.length }
}

/** advance = everything paid up front, later = only pledges, flex = both. */
export const getPaymentTiming = (payments: BountyPayment[]): PaymentTiming => {
  const hasPaid = payments.some((p) => p.state === 'paid')
  const hasPledged = payments.some((p) => p.state === 'pledged')
  if (hasPledged && hasPaid) return 'flex'
  if (hasPledged) return 'later'
  return 'advance'
}

export const getIssueVisibility = (taskData: any): IssueVisibility =>
  taskData?.not_listed ? 'unlisted' : 'public'

export const getDeadlineInfo = (
  deadline: string | Date | null | undefined,
  now: Date = new Date()
): DeadlineInfo | undefined => {
  if (!deadline) return undefined
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return undefined
  const dayMs = 24 * 60 * 60 * 1000
  const startOfDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const daysLeft = Math.round((startOfDay(date) - startOfDay(now)) / dayMs)
  return { date: date.toISOString(), daysLeft, overdue: daysLeft < 0 }
}

export const getGithubInfo = (taskData: any): GithubIssueInfo | undefined => {
  const issue = taskData?.metadata?.issue
  if (taskData?.provider !== 'github' || !issue || typeof issue !== 'object') return undefined
  return {
    status: issue.state === 'closed' ? 'closed' : 'open',
    repoPrivate: Boolean(taskData?.private || issue?.repository?.private),
    author: personFromGithub(issue.user),
    assignees: (issue.assignees || []).map(personFromGithub).filter(Boolean) as Person[],
    comments: typeof issue.comments === 'number' ? issue.comments : undefined,
    updatedAt: issue.updated_at,
    url: issue.html_url || taskData?.url
  }
}

export const getImporter = (taskData: any): Person | undefined => personFromUser(taskData?.User)

/**
 * Whether whoever imported the issue on Gitpay is also its author on GitHub.
 * `undefined` when we can't tell — the header then shows neither tag.
 */
export const isImporterAuthor = (taskData: any): boolean | undefined => {
  const login = taskData?.metadata?.issue?.user?.login
  const importerLogin = taskData?.User?.provider_username || taskData?.User?.username
  if (!login || !importerLogin) return undefined
  return String(login).toLowerCase() === String(importerLogin).toLowerCase()
}

export const getLabels = (taskData: any): { name: string; color?: string }[] =>
  (taskData?.metadata?.labels || []).filter((label: any) => label && label.name)

export const isBountyLocked = (taskData: any): boolean =>
  Boolean(taskData?.paid || taskData?.transfer_id || taskData?.Transfer?.id)

export const hasBountyAvailable = (taskData: any): boolean => {
  const value = Number(taskData?.value)
  return Number.isFinite(value) && value > 0 && !taskData?.paid
}

export type SolutionCheck = {
  id:
    | 'bounty'
    | 'connected'
    | 'author'
    | 'merged'
    | 'issueClosed'
    | 'referenced'
  state: ChecklistState
}

/**
 * The six send-solution checks. `pullRequestData` is the existing
 * `fetchPullRequestData` result; before a URL is checked every PR rule is
 * `failed`. A missing bounty is a warning, not a blocker for showing the list.
 */
export const getSolutionChecklist = ({
  pullRequestData,
  bountyAvailable
}: {
  pullRequestData?: any
  bountyAvailable: boolean
}): SolutionCheck[] => {
  const pr = pullRequestData || {}
  const flag = (value: unknown): ChecklistState => (value ? 'checked' : 'failed')
  return [
    { id: 'bounty', state: bountyAvailable ? 'checked' : 'warning' },
    { id: 'connected', state: flag(pr.isConnectedToGitHub) },
    { id: 'author', state: flag(pr.isAuthorOfPR) },
    { id: 'merged', state: pr.isAuthorOfPR && !pr.isPRMerged ? 'warning' : flag(pr.isPRMerged) },
    { id: 'issueClosed', state: flag(pr.isIssueClosed) },
    { id: 'referenced', state: flag(pr.hasIssueReference) }
  ]
}

/** The submit rule is unchanged from the previous drawer. */
export const canSubmitSolution = ({
  pullRequestURL,
  pullRequestData,
  taskData
}: {
  pullRequestURL: string
  pullRequestData?: any
  taskData: any
}): boolean => {
  const pr = pullRequestData || {}
  return Boolean(
    pullRequestURL &&
      pr.isConnectedToGitHub &&
      pr.isAuthorOfPR &&
      pr.isPRMerged &&
      pr.isIssueClosed &&
      pr.hasIssueReference &&
      hasBountyAvailable(taskData) &&
      !isBountyLocked(taskData)
  )
}

export type AddBountyFooter =
  | 'pledge'
  | 'invoice'
  | 'wallet'
  | 'walletShort'
  | 'card'

export const getAddBountyFooter = ({
  method,
  later = false,
  amount = 0,
  walletBalance
}: {
  method: PaymentMethod
  later?: boolean
  amount?: number
  walletBalance?: number
}): AddBountyFooter => {
  if (later) return 'pledge'
  if (method === 'invoice') return 'invoice'
  if (method === 'wallet') {
    return typeof walletBalance === 'number' && walletBalance < amount ? 'walletShort' : 'wallet'
  }
  return 'card'
}

export const formatUSD = (amount: number, fractionDigits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount || 0)

export type SolutionSummary = {
  id: number | string
  author: { name: string; avatarUrl?: string }
  pullRequest: { number?: number; title: string; url: string; state: 'open' | 'merged' | 'closed' }
  sentAt?: string
  payout?: 'ready' | 'waiting' | 'none'
}

const pullNumberFromUrl = (url: string): number | undefined => {
  const match = /\/pull\/(\d+)/.exec(url || '')
  return match ? Number(match[1]) : undefined
}

/**
 * Today the page only knows the current user's own solution (`taskSolution`).
 * It becomes a one-row solutions list; a full list arrives later through the same shape.
 */
export const getSolutionsFromTaskSolution = (
  taskSolution: any,
  user: any
): SolutionSummary[] => {
  if (!taskSolution || !taskSolution.id || !taskSolution.pullRequestURL) return []
  const url = taskSolution.pullRequestURL
  const number = pullNumberFromUrl(url)
  const merged = Boolean(taskSolution.isPRMerged)
  return [
    {
      id: taskSolution.id,
      author: { name: user?.data?.name || user?.data?.username || 'You' },
      pullRequest: {
        number,
        title: number ? url.replace(/^https?:\/\/(www\.)?github\.com\//, '') : url,
        url,
        state: merged ? 'merged' : 'open'
      },
      sentAt: taskSolution.createdAt,
      payout: merged ? 'ready' : 'waiting'
    }
  ]
}
