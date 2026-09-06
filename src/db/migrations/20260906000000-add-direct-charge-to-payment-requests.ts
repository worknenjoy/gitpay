import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequests', 'direct_charge', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequests', 'direct_charge')
}
