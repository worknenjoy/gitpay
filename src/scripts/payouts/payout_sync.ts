import { Op } from 'sequelize'
import Models from '../../models'
import Stripe from '../../client/payment/stripe'

const models = Models as any
const stripe = Stripe()

// Fetch payouts, sync with Stripe, and log updates step-by-step
;(async function main() {
  console.log('[payout_sync] Starting payout synchronization...')
  if (!models?.Payout) {
    console.error('[payout_sync] ERROR: models.Payout not found.')
    process.exit(1)
  }

  let total = 0
  let updated = 0
  try {
    console.log('[payout_sync] Loading payouts from database...')
    const payouts = await models.Payout.findAll({
      where: { source_id: { [Op.ne]: null } },
      method: 'bank_account',
      include: [models.User]
    })

    total = payouts.length
    console.log(`[payout_sync] Found ${total} payouts to sync.`)

    for (const payout of payouts) {
      const id = payout.source_id
      if (!id) {
        console.log(`[payout_sync] Skipping payout id=${payout.id} (no source_id).`)
        continue
      }

      // Determine the connected account ID
      const connectedAccountId = payout.User?.account_id as string | undefined

      if (!connectedAccountId) {
        console.warn(`[payout_sync] Skipping payout id=${payout.id} (no connected account id).`)
        continue
      }

      console.log(
        `[payout_sync] Retrieving Stripe payout: ${id} from account ${connectedAccountId}...`
      )
      try {
        // Retrieve payout from the connected account by setting the Stripe-Account header
        const sp = await stripe.payouts.retrieve(id, { stripeAccount: connectedAccountId })

        const changes: Record<string, { from: any; to: any }> = {}

        // Map Stripe fields to local model
        const nextStatus = sp.status // expected: 'paid', 'pending', 'in_transit', 'canceled', 'failed'
        const nextPaid = sp.status === 'paid'
        const nextArrival = typeof sp.arrival_date === 'number' ? sp.arrival_date : null
        const nextRef = (sp as any).trace_id?.value || payout.reference_number

        // Prepare diff detection
        const maybeSet = (key: string, nextVal: any, currentVal: any) => {
          if (nextVal !== currentVal) {
            changes[key] = { from: currentVal, to: nextVal }
            ;(payout as any)[key] = nextVal
          }
        }

        maybeSet('status', nextStatus, payout.status)
        maybeSet('paid', nextPaid, payout.paid)
        maybeSet('arrival_date', nextArrival, payout.arrival_date)
        maybeSet('reference_number', nextRef, payout.reference_number)

        if (Object.keys(changes).length > 0) {
          await payout.save()
          updated++
          console.log(`[payout_sync] Updated payout id=${payout.id} (source_id=${id}):`)
          for (const [field, diff] of Object.entries(changes)) {
            console.log(`  - ${field}: ${JSON.stringify(diff.from)} -> ${JSON.stringify(diff.to)}`)
          }
        } else {
          console.log(`[payout_sync] No changes for payout id=${payout.id} (source_id=${id}).`)
        }
      } catch (err: any) {
        console.error(
          `[payout_sync] ERROR retrieving Stripe payout ${id} for payout id=${payout.id} (acct=${connectedAccountId}): ${err?.message || err}`
        )
        // Continue with next payout
      }
    }

    console.log(
      `[payout_sync] Sync completed. Total=${total}, Updated=${updated}, Unchanged=${total - updated}.`
    )
    process.exit(0)
  } catch (err: any) {
    console.error('[payout_sync] Fatal error:', err?.message || err)
    process.exit(1)
  }
})()
