import { QueryInterface } from 'sequelize'

/**
 * The previous migration backfilled every existing WalletOrder to provider='stripe'
 * (its column default), but rows created while PAYMENT_PROVIDER=whop actually hold a
 * Whop invoice id in `source` (format "inv_..."), not a Stripe one ("in_..."). Fix
 * those up using that id-prefix distinction, since the provider used at creation time
 * was never recorded on the row before now.
 */
export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.sequelize.query(
    `UPDATE "WalletOrders" SET provider = 'whop' WHERE source ~ '^inv_'`
  )
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.sequelize.query(
    `UPDATE "WalletOrders" SET provider = 'stripe' WHERE source ~ '^inv_'`
  )
}
