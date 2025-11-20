import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export type BalanceTransactionType = 'CREDIT' | 'DEBIT'
export type BalanceTransactionReason = 'DISPUTE' | 'REFUND' | 'EXTRA_FEE' | 'ADJUSTMENT'

export interface PaymentRequestBalanceTransactionAttributes {
  id: number
  amount: string
  currency: string
  sourceId: string
  type: BalanceTransactionType
  reason: BalanceTransactionReason
  reason_details: string
  status: string
  paymentRequestBalanceId: number
  openedAt?: Date
  closedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentRequestBalanceTransactionCreationAttributes = Optional<
  PaymentRequestBalanceTransactionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export default class PaymentRequestBalanceTransaction
  extends Model<
    PaymentRequestBalanceTransactionAttributes,
    PaymentRequestBalanceTransactionCreationAttributes
  >
  implements PaymentRequestBalanceTransactionAttributes
{
  public id!: number
  public sourceId!: string
  public amount!: string
  public currency!: string
  public type!: BalanceTransactionType
  public reason!: BalanceTransactionReason
  public reason_details!: string
  public status!: string
  public paymentRequestBalanceId!: number
  public openedAt?: Date
  public closedAt?: Date
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentRequestBalanceTransaction {
    PaymentRequestBalanceTransaction.init(
      {
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
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'PaymentRequestBalanceTransactions',
        timestamps: true,
        hooks: {
          // After creating the transaction, atomically apply the delta to the balance.
          afterCreate: async (instance: PaymentRequestBalanceTransaction, options: any) => {
            if (!instance.paymentRequestBalanceId) return
            const op = '+'
            // Use SQL literal to avoid precision loss with BIGINT and keep it atomic.
            await sequelize.models.PaymentRequestBalance.update(
              { balance: sequelize.literal(`balance ${op} ${instance.amount}`) },
              {
                where: { id: instance.paymentRequestBalanceId },
                transaction: options?.transaction,
              },
            )
          },
        },
      },
    )
    return PaymentRequestBalanceTransaction
  }

  static associate(models: any) {
    models.PaymentRequestBalanceTransaction.belongsTo(models.PaymentRequestBalance, {
      //as: 'PaymentRequestBalance',
      foreignKey: 'paymentRequestBalanceId',
      targetKey: 'id',
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentRequestBalanceTransaction.initModel(sequelize)
}
module.exports.PaymentRequestBalanceTransaction = PaymentRequestBalanceTransaction
module.exports.default = PaymentRequestBalanceTransaction
