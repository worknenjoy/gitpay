import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.addColumn('Users', 'recover_password_token_expires_at', {
    type: DataTypes.DATE,
    allowNull: true
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.removeColumn('Users', 'recover_password_token_expires_at')
}
