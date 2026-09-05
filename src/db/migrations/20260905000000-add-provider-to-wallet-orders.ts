import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('WalletOrders', 'provider', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'stripe'
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('WalletOrders', 'provider')
}
