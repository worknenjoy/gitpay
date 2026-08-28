import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Users', 'terms_accepted_at', {
    type: DataTypes.DATE,
    allowNull: true
  })
  // Grandfather every account that already exists so only genuinely new signups
  // (currently just GitHub) are gated behind terms acceptance going forward.
  await queryInterface.sequelize.query(
    'UPDATE "Users" SET terms_accepted_at = NOW() WHERE terms_accepted_at IS NULL'
  )
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Users', 'terms_accepted_at')
}
