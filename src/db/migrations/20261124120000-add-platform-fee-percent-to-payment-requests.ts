import { QueryInterface, DataTypes } from 'sequelize'

/**
 * Snapshot of Gitpay's platform fee (% of gross) charged on each payment request.
 * Existing rows were all charged 8% (both Stripe and Whop direct charge), so the
 * default backfills them correctly. New rows set it explicitly at creation — see
 * src/services/paymentRequest/platformFee.ts.
 */
export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequests', 'platform_fee_percent', {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 8
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequests', 'platform_fee_percent')
}
