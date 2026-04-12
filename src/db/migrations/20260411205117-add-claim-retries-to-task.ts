import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Tasks', 'claim_retries', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Tasks', 'claim_retries')
}
