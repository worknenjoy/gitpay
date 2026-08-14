export type WhopAccountStatus = 'rejected' | 'active' | 'pending'

/**
 * Single source of truth for "is this Whop account okay" — used by both the header
 * badge/banner and the verification-return notification, so they can never disagree.
 *
 * NOTE: this intentionally no longer derives anything from `requirements.checklist`
 * (the "Requirements" panel/tab was removed — see payout-settings-whop.tsx). That
 * checklist's `identity_document` item was keyed off `company.verified`, which Whop's
 * docs confirm is a trust & safety review flag set by Whop staff, not KYC/identity
 * verification completion — so it could report "required" for accounts that were
 * genuinely already verified. `rejected` is kept because `disabled_reason` is a
 * different, Whop-reported signal, not derived from the same misleading flag.
 */
export function getWhopAccountStatus(account: any): {
  status: WhopAccountStatus
  rejected: boolean
} {
  const data = account?.data || {}
  const rejected = Boolean(data?.requirements?.disabled_reason?.startsWith?.('rejected'))
  const status: WhopAccountStatus = rejected ? 'rejected' : data?.active ? 'active' : 'pending'
  return { status, rejected }
}
