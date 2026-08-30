import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequests', 'tier', {
    type: DataTypes.STRING,
    allowNull: true
  })
  await queryInterface.addColumn('PaymentRequests', 'featured', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequests', 'featured')
  await queryInterface.removeColumn('PaymentRequests', 'tier')
}
