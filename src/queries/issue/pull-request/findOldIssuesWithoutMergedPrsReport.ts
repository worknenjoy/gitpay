import Models from '../../../models'
import { findIssuesCreatedBefore } from '../findIssuesCreatedBefore'
import { findIssueLinkedPullRequest } from './findIssueLinkedPullRequest'

const models = Models as any

export type OldIssuesWithoutMergedPrsReportOptions = {
  now?: Date
  olderThanDays?: number
  /** Optional Sequelize findAll options merged into the base query. */
  findOptions?: any
}

type OrderLike = {
  id: number
  provider?: string | null
  source_type?: string | null
  currency?: string | null
  amount?: string | number | null
  status?: string | null
  paid?: boolean | null
  createdAt?: Date
  ordered_in?: Date | null
}

type PullRequestLike = {
  html_url?: string
  number?: number
  title?: string
  state?: string
  draft?: boolean
  user?: { login?: string; id?: number }
  pull_request?: { merged_at?: string | null; draft?: boolean }
}

const toNumber = (value: unknown) => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

const normalizeProvider = (provider: unknown) => {
  const p = String(provider ?? '')
    .toLowerCase()
    .trim()
  if (p === 'paypal') return 'paypal'
  if (p === 'stripe') return 'stripe'
  return p || 'unknown'
}

const normalizeType = (sourceType: unknown) => {
  const t = String(sourceType ?? '')
    .toLowerCase()
    .trim()
  return t || 'unknown'
}

const isDraftPr = (pr: PullRequestLike) => Boolean(pr?.draft || pr?.pull_request?.draft)

const isMergedPr = (pr: PullRequestLike) => pr?.pull_request?.merged_at != null

export const findOldIssuesWithoutMergedPrsReport = async (
  options: OldIssuesWithoutMergedPrsReportOptions = {}
) => {
  const now = options.now ?? new Date()
  const olderThanDays = options.olderThanDays ?? 365
  const cutoffDate = new Date(now.getTime() - olderThanDays * 24 * 60 * 60 * 1000)

  const oldIssues = await findIssuesCreatedBefore(cutoffDate, {
    include: [
      {
        model: models.Order,
        where: {
          status: 'succeeded',
          paid: true
        },
        required: false
      }
    ],
    ...options.findOptions
  })

  const entries = await Promise.all(
    (oldIssues ?? []).map(async (issue: any) => {
      try {
        const linkedPrs = (await findIssueLinkedPullRequest(issue.id)) as PullRequestLike[]
        const mergedPrs = linkedPrs.filter(isMergedPr)
        if (mergedPrs.length > 0) return false

        const orders = (issue?.Orders ?? issue?.orders ?? []) as OrderLike[]

        const ordersByProvider: Record<string, OrderLike[]> = {}
        const ordersByProviderAndType: Record<string, Record<string, OrderLike[]>> = {}
        const orderStatsByProvider: Record<
          string,
          {
            count: number
            paidCount: number
            totalAmount: number
            paidAmount: number
            currencies: string[]
          }
        > = {}

        for (const order of orders) {
          const provider = normalizeProvider(order.provider)
          const type = normalizeType(order.source_type)

          ordersByProvider[provider] = ordersByProvider[provider] ?? []
          ordersByProvider[provider].push(order)

          ordersByProviderAndType[provider] = ordersByProviderAndType[provider] ?? {}
          ordersByProviderAndType[provider][type] = ordersByProviderAndType[provider][type] ?? []
          ordersByProviderAndType[provider][type].push(order)

          const stats =
            orderStatsByProvider[provider] ??
            (orderStatsByProvider[provider] = {
              count: 0,
              paidCount: 0,
              totalAmount: 0,
              paidAmount: 0,
              currencies: []
            })
          stats.count += 1
          const amount = toNumber(order.amount)
          stats.totalAmount += amount
          if (order.paid) {
            stats.paidCount += 1
            stats.paidAmount += amount
          }
          if (order.currency && !stats.currencies.includes(order.currency)) {
            stats.currencies.push(order.currency)
          }
        }

        const linkedPrsDraft = linkedPrs.filter(isDraftPr)
        const linkedPrsUnmerged = linkedPrs.filter((pr) => !isMergedPr(pr))

        const createdAt = issue?.createdAt ? new Date(issue.createdAt) : null
        const ageDays = createdAt
          ? Math.floor((now.getTime() - createdAt.getTime()) / 86400000)
          : null

        const orderDates = orders
          .map((o) => o.ordered_in ?? o.createdAt)
          .filter(Boolean)
          .map((d) => new Date(d as any).getTime())
        const lastOrderAt = orderDates.length ? new Date(Math.max(...orderDates)) : null

        return {
          issue,
          cutoffDate,
          now,
          ageDays,
          lastOrderAt,
          orders,
          ordersByProvider,
          ordersByProviderAndType,
          orderStatsByProvider,
          pullRequests: {
            linked: linkedPrs,
            draft: linkedPrsDraft,
            unmerged: linkedPrsUnmerged
          }
        }
      } catch (err) {
        return false
      }
    })
  )

  return entries.filter(Boolean)
}
