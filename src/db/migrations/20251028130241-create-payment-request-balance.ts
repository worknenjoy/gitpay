import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.createTable('PaymentRequestBalances', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'usd'
    },
    userId: {
      unique: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.dropTable('PaymentRequestBalances')
}
