import { syncInfo } from '../../modules/info/syncInfo'

async function main() {
  console.log('Syncing platform public stats...\n')
  try {
    const stats = await syncInfo()

    const totalPaid =
      stats.total_paid_for_bounties_count + stats.total_paid_for_payment_requests_count

    console.log('=== Platform Public Stats Summary ===')
    console.log(`  Users                       : ${stats.users_count}`)
    console.log(`  User countries              : ${stats.total_user_countries_count}`)
    console.log(`  Slack channel members       : ${stats.slack_channel_users_count}`)
    console.log(`  Bounties (tasks)            : ${stats.payment_request_count}`)
    console.log(`  Payment requests            : ${stats.payment_request_count}`)
    console.log(`  Payment request payments    : ${stats.payment_requests_payments_count}`)
    console.log(`  Total paid for bounties     : $${stats.total_paid_for_bounties_count}`)
    console.log(`  Total paid for pay requests : $${stats.total_paid_for_payment_requests_count}`)
    console.log(`  Total paid (combined)       : $${totalPaid}`)
    console.log('=====================================\n')
    console.log('Synced successfully.')
  } catch (err: any) {
    console.error('Error syncing platform public stats:', err?.message ?? err)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
