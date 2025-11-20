import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PaymentRequestBalanceAttributes {
  id: number
  balance: string
  currency: string
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentRequestBalanceCreationAttributes = Optional<
  PaymentRequestBalanceAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export default class PaymentRequestBalance
  extends Model<PaymentRequestBalanceAttributes, PaymentRequestBalanceCreationAttributes>
  implements PaymentRequestBalanceAttributes
{
  public id!: number
  public balance!: string
  public currency!: string
  public userId!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentRequestBalance {
    PaymentRequestBalance.init(
      {
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
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        tableName: 'PaymentRequestBalances',
        timestamps: true
      }
    )
    return PaymentRequestBalance
  }

  static associate(models: any) {
    models.PaymentRequestBalance.belongsTo(models.User, {
      //as: 'User',
      foreignKey: 'userId'
    })
    models.PaymentRequestBalance.hasMany(models.PaymentRequestBalanceTransaction, {
      //as: 'transactions',
      foreignKey: 'paymentRequestBalanceId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentRequestBalance.initModel(sequelize)
}
module.exports.PaymentRequestBalance = PaymentRequestBalance
module.exports.default = PaymentRequestBalance
