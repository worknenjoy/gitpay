import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Users', 'activation_token_sent_at', {
    type: DataTypes.DATE,
    allowNull: true
  })
  await queryInterface.addColumn('Users', 'activation_token_expires_at', {
    type: DataTypes.DATE,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Users', 'activation_token_sent_at')
  await queryInterface.removeColumn('Users', 'activation_token_expires_at')
}
