import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Users', 'whop_account_id', {
    type: DataTypes.STRING,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Users', 'whop_account_id')
}
