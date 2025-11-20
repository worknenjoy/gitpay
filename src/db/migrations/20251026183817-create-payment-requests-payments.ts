import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.createTable('PaymentRequestPayments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transferStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PaymentRequestCustomers',
        key: 'id',
      },
    },
    paymentRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PaymentRequests',
        key: 'id',
      },
    },
    transferId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PaymentRequestTransfers',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
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
  await queryInterface.dropTable('PaymentRequestPayments')
}
