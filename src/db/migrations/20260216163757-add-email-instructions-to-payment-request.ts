import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('PaymentRequests', 'send_instructions_email', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  })
  await queryInterface.addColumn('PaymentRequests', 'instructions_content', {
    type: DataTypes.TEXT,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('PaymentRequests', 'send_instructions_email')
  await queryInterface.removeColumn('PaymentRequests', 'instructions_content')
}
