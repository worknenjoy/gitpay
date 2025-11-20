import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.createTable('PaymentRequestBalanceTransactions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sourceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'usd',
    },
    type: {
      type: DataTypes.ENUM('CREDIT', 'DEBIT'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM('DISPUTE', 'REFUND', 'EXTRA_FEE', 'ADJUSTMENT'),
      allowNull: false,
    },
    reason_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentRequestBalanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PaymentRequestBalances',
        key: 'id',
      },
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.dropTable('PaymentRequestBalanceTransactions')
}
