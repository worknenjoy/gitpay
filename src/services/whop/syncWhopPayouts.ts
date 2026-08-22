/* eslint-disable no-console */
import { Op } from 'sequelize'
import Models from '../../models'
import { getPaymentProvider } from '../../providers'
import { upsertWhopPayoutFromWithdrawal } from '../../modules/webhooks/register/whopHandlers'

const models = Models as any

export type SyncWhopPayoutsOptions = {
  /** Only fetch withdrawals created after this date. Omit for a full-history pass. */
  since?: Date
}

export type SyncWhopPayoutsResult = {
  companyId: string
  scanned: number
  failed: number
  errors: Array<{ withdrawalId: string; error: string }>
}

/**
 * Reconcile Payout rows for one connected Whop company against Whop's own
 * withdrawal history, via the same create-or-update logic the webhook uses
 * (upsertWhopPayoutFromWithdrawal) — so this never drifts from webhook
 * behavior. Paginates through the full result set for the given window.
 *
 * `since` bounds the query (used by the hourly cron for a cheap recent-window
 * pass); omitted, this walks the company's entire withdrawal history (used by
 * the one-off manual sync script for historical backfill / full audit).
 */
export async function syncWhopPayoutsForCompany(
  companyId: string,
  options: SyncWhopPayoutsOptions = {}
): Promise<SyncWhopPayoutsResult> {
  const provider: any = getPaymentProvider('whop')
  const result: SyncWhopPayoutsResult = { companyId, scanned: 0, failed: 0, errors: [] }

  const createdAfter = options.since ? Math.floor(options.since.getTime() / 1000) : undefined
  let pageCursor: string | undefined
  let hasMore = true

  while (hasMore) {
    const page = await provider.listWithdrawals(companyId, {
      createdAfter,
      first: 50,
      pageCursor
    })

    for (const withdrawal of page.withdrawals || []) {
      result.scanned += 1
      try {
        await upsertWhopPayoutFromWithdrawal(withdrawal, companyId)
      } catch (error: any) {
        const message = error?.message || String(error)
        result.errors.push({ withdrawalId: withdrawal?.id, error: message })
        result.failed += 1
        console.error(
          `[whop-payout-sync] withdrawal ${withdrawal?.id} (company ${companyId}) failed:`,
          message
        )
      }
    }

    hasMore = Boolean(page.hasMore && page.endCursor)
    pageCursor = page.endCursor || undefined
  }

  return result
}

export type SyncWhopPayoutsForAllCompaniesResult = {
  companies: number
} & Pick<SyncWhopPayoutsResult, 'scanned' | 'failed'> & {
    errors: Array<{ companyId: string; withdrawalId: string; error: string }>
  }

/**
 * Runs syncWhopPayoutsForCompany for every connected Whop company
 * (Users.whop_account_id set). One company failing to sync doesn't block the
 * rest.
 */
export async function syncWhopPayoutsForAllCompanies(
  options: SyncWhopPayoutsOptions = {}
): Promise<SyncWhopPayoutsForAllCompaniesResult> {
  const users = await models.User.findAll({
    where: { whop_account_id: { [Op.ne]: null } },
    attributes: ['whop_account_id'],
    group: ['whop_account_id']
  })

  const companyIds: string[] = users
    .map((u: any) => u.whop_account_id)
    .filter((id: string | null) => Boolean(id))

  const result: SyncWhopPayoutsForAllCompaniesResult = {
    companies: companyIds.length,
    scanned: 0,
    failed: 0,
    errors: []
  }

  for (const companyId of companyIds) {
    try {
      const companyResult = await syncWhopPayoutsForCompany(companyId, options)
      result.scanned += companyResult.scanned
      result.failed += companyResult.failed
      result.errors.push(
        ...companyResult.errors.map((e) => ({
          companyId,
          withdrawalId: e.withdrawalId,
          error: e.error
        }))
      )
    } catch (error: any) {
      const message = error?.message || String(error)
      result.errors.push({ companyId, withdrawalId: '', error: message })
      console.error(`[whop-payout-sync] company ${companyId} sync failed:`, message)
    }
  }

  console.log(
    `[whop-payout-sync] Done. companies=${result.companies} scanned=${result.scanned} failed=${result.failed}`
  )

  return result
}
