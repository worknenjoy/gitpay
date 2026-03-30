import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Tasks', 'state', {
    type: DataTypes.ENUM('created', 'funded', 'claimed', 'completed'),
    allowNull: true,
    defaultValue: 'created'
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Tasks', 'state')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tasks_state";')
}
