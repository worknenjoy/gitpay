import { QueryInterface, DataTypes } from 'sequelize'

/**
 * Whop platform net after processor fees (major currency units).
 * Used as the base for Gitpay's 8% fee / claim transfer amount.
 * Null for Stripe (and membership-only events until payment.succeeded upgrades the row).
 */
export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequestPayments', 'amount_after_fees', {
    type: DataTypes.DECIMAL,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequestPayments', 'amount_after_fees')
}
