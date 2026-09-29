import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequests', 'typeId', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PaymentLinkTypes',
      key: 'id'
    }
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequests', 'typeId')
}
