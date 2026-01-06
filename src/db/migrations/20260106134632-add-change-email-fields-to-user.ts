import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Users', 'pending_email_change', {
    type: DataTypes.STRING,
    allowNull: true
  })
  await queryInterface.addColumn('Users', 'email_change_token', {
    type: DataTypes.STRING,
    allowNull: true
  })
  await queryInterface.addColumn('Users', 'email_change_token_expires_at', {
    type: DataTypes.DATE,
    allowNull: true
  })
  await queryInterface.addColumn('Users', 'email_change_requested_at', {
    type: DataTypes.DATE,
    allowNull: true
  })
  await queryInterface.addColumn('Users', 'email_change_attempts', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  })
  await queryInterface.addIndex('Users', ['email_change_token'])
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Users', 'pending_email_change')
  await queryInterface.removeColumn('Users', 'email_change_token')
  await queryInterface.removeColumn('Users', 'email_change_token_expires_at')
  await queryInterface.removeColumn('Users', 'email_change_requested_at')
  await queryInterface.removeColumn('Users', 'email_change_attempts')
  await queryInterface.removeIndex('Users', ['email_change_token'])
}
