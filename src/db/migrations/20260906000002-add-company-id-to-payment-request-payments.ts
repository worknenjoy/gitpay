import { QueryInterface, DataTypes } from 'sequelize'

/**
 * Per-payment snapshot of which Whop company was the merchant of record
 * (company_id) and which connected account received the funds
 * (destination_account_id) for this specific payment, captured from the webhook
 * payload at processing time. Kept independent of User.whop_account_id /
 * PaymentRequest.direct_charge so historical records stay accurate even if those
 * change later, and so webhook handlers can tell a direct-charge event
 * (company_id = the seller's connected company) apart from a legacy
 * platform-charge event (company_id = WHOP_COMPANY_ID) by comparing company_id
 * directly rather than trusting current settings. Null for Stripe payments and for
 * rows recorded before this field was captured.
 */
export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequestPayments', 'company_id', {
    type: DataTypes.STRING,
    allowNull: true
  })
  await queryInterface.addColumn('PaymentRequestPayments', 'destination_account_id', {
    type: DataTypes.STRING,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequestPayments', 'destination_account_id')
  await queryInterface.removeColumn('PaymentRequestPayments', 'company_id')
}
