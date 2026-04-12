import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Tasks', 'closed_reason', {
    type: DataTypes.ENUM('refunded', 'manual', 'other'),
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Tasks', 'closed_reason')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tasks_closed_reason";')
}
