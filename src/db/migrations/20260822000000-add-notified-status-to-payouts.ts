import { QueryInterface, DataTypes } from 'sequelize'

/**
 * Tracks the last payout status the user was actually emailed about, distinct
 * from `status` (the last status the provider reported). Lets the webhook/cron/
 * sync paths retry a failed PayoutMail send on their next pass instead of losing
 * it silently once `status` already matches.
 */
export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Payouts', 'notified_status', {
    type: DataTypes.STRING,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Payouts', 'notified_status')
}
