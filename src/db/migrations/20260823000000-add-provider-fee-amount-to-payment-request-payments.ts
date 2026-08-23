import { QueryInterface, DataTypes } from 'sequelize'

/**
 * The payment provider's own reported fee for this payment (major currency units),
 * e.g. Whop's `application_fee.amount` from the payment.succeeded webhook. Null for
 * providers/events that don't report it, and for rows recorded before this field
 * was captured (those fall back to amount - amount_after_fees for display).
 */
export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequestPayments', 'provider_fee_amount', {
    type: DataTypes.DECIMAL,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequestPayments', 'provider_fee_amount')
}
