import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.createTable('PaymentRequestBalanceTransactions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('CREDIT', 'DEBIT'),
      allowNull: false
    },
    reason: {
      type: DataTypes.ENUM('DISPUTE', 'REFUND', 'EXTRA_FEE', 'ADJUSTMENT'),
      allowNull: false
    },
    paymentRequestBalanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PaymentRequestBalances',
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
  await queryInterface.dropTable('PaymentRequestBalanceTransactions')
}