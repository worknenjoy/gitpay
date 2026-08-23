import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PaymentRequestPaymentAttributes {
  id: number
  source: string
  amount: string
  /** Platform net after processor fees (Whop). Null for Stripe / unknown. */
  amount_after_fees?: string | null
  /** Payment provider's own reported fee for this payment (e.g. Whop's application fee). Null when not reported. */
  provider_fee_amount?: string | null
  currency: string
  status: string
  transferStatus?: string | null
  customerId: number
  paymentRequestId: number
  transferId?: number | null
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentRequestPaymentCreationAttributes = Optional<
  PaymentRequestPaymentAttributes,
  | 'id'
  | 'amount_after_fees'
  | 'provider_fee_amount'
  | 'transferStatus'
  | 'transferId'
  | 'createdAt'
  | 'updatedAt'
>

export default class PaymentRequestPayment
  extends Model<PaymentRequestPaymentAttributes, PaymentRequestPaymentCreationAttributes>
  implements PaymentRequestPaymentAttributes
{
  public id!: number
  public source!: string
  public amount!: string
  public amount_after_fees!: string | null
  public provider_fee_amount!: string | null
  public currency!: string
  public status!: string
  public transferStatus!: string | null
  public customerId!: number
  public paymentRequestId!: number
  public transferId!: number | null
  public userId!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentRequestPayment {
    PaymentRequestPayment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        source: {
          type: DataTypes.STRING,
          allowNull: false
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          defaultValue: 0
        },
        amount_after_fees: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        provider_fee_amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'USD'
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false
        },
        transferStatus: {
          type: DataTypes.STRING,
          allowNull: true
        },
        customerId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        paymentRequestId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        transferId: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        userId: {
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
        tableName: 'PaymentRequestPayments',
        timestamps: true
      }
    )
    return PaymentRequestPayment
  }

  static associate(models: any) {
    // PaymentRequestPayment hasOne PaymentRequestCustomer
    models.PaymentRequestPayment.belongsTo(models.PaymentRequestCustomer, {
      //as: 'PaymentRequestCustomer',
      foreignKey: 'customerId',
      targetKey: 'id'
    })

    // PaymentRequestPayment belongs to PaymentRequest
    models.PaymentRequestPayment.belongsTo(models.PaymentRequest, {
      //as: 'PaymentRequest',
      foreignKey: 'paymentRequestId'
    })

    // PaymentRequestPayment belongs to PaymentRequestTransfer
    models.PaymentRequestPayment.belongsTo(models.PaymentRequestTransfer, {
      //as: 'PaymentRequestTransfer',
      foreignKey: 'transferId'
    })

    models.PaymentRequestPayment.belongsTo(models.User, {
      //as: 'User',
      foreignKey: 'userId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentRequestPayment.initModel(sequelize)
}
module.exports.PaymentRequestPayment = PaymentRequestPayment
module.exports.default = PaymentRequestPayment
