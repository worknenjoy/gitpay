import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PlatformPublicStats', 'users_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
  await queryInterface.addColumn('PlatformPublicStats', 'payment_requests_payments_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
  await queryInterface.addColumn('PlatformPublicStats', 'payment_request_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
  await queryInterface.addColumn('PlatformPublicStats', 'total_paid_for_bounties_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
  await queryInterface.addColumn('PlatformPublicStats', 'total_paid_for_payment_requests_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
  await queryInterface.addColumn('PlatformPublicStats', 'total_user_countries_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
  await queryInterface.addColumn('PlatformPublicStats', 'slack_channel_users_count', {
    type: DataTypes.INTEGER,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PlatformPublicStats', 'users_count')
  await queryInterface.removeColumn('PlatformPublicStats', 'payment_requests_payments_count')
  await queryInterface.removeColumn('PlatformPublicStats', 'payment_request_count')
  await queryInterface.removeColumn('PlatformPublicStats', 'total_paid_for_bounties_count')
  await queryInterface.removeColumn('PlatformPublicStats', 'total_paid_for_payment_requests_count')
  await queryInterface.removeColumn('PlatformPublicStats', 'total_user_countries_count')
  await queryInterface.removeColumn('PlatformPublicStats', 'slack_channel_users_count')
}
