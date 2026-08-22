import { syncWhopPayoutsForAllCompanies } from '../../services/whop/syncWhopPayouts'

const RECENT_WINDOW_DAYS = 7

const WhopPayoutSyncCron = {
  /**
   * Bounded backstop for the Whop payout webhook: reconciles only recent
   * withdrawal activity (last 7 days) across all connected companies, so it
   * stays cheap to run frequently. Historical backfill is handled separately
   * by the manual `scripts:whop:sync_payouts` command (full history, on demand).
   */
  syncRecentPayouts: async () => {
    const since = new Date(Date.now() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    return syncWhopPayoutsForAllCompanies({ since })
  }
}

module.exports = WhopPayoutSyncCron
export default WhopPayoutSyncCron
