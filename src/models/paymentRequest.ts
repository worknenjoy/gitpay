import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PaymentRequestAttributes {
  id: number
  active: boolean
  deactivate_after_payment: boolean
  currency?: string | null
  amount?: string | null
  custom_amount: boolean
  title?: string | null
  description?: string | null
  payment_link_id?: string | null
  payment_url?: string | null
  status: string
  transfer_status: string
  transfer_id?: string | null
  userId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentRequestCreationAttributes = Optional<
  PaymentRequestAttributes,
  'id' | 'active' | 'deactivate_after_payment' | 'currency' | 'amount' | 'custom_amount' | 'title' | 'description' | 'payment_link_id' | 'payment_url' | 'status' | 'transfer_status' | 'transfer_id' | 'userId' | 'createdAt' | 'updatedAt'
>

export default class PaymentRequest
  extends Model<PaymentRequestAttributes, PaymentRequestCreationAttributes>
  implements PaymentRequestAttributes
{
  public id!: number
  public active!: boolean
  public deactivate_after_payment!: boolean
  public currency!: string | null
  public amount!: string | null
  public custom_amount!: boolean
  public title!: string | null
  public description!: string | null
  public payment_link_id!: string | null
  public payment_url!: string | null
  public status!: string
  public transfer_status!: string
  public transfer_id!: string | null
  public userId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentRequest {
    PaymentRequest.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        deactivate_after_payment: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: true
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        custom_amount: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        payment_link_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        payment_url: {
          type: DataTypes.STRING,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'open'
        },
        transfer_status: {
          type: DataTypes.STRING,
          defaultValue: 'pending_payment'
        },
        transfer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true
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
        tableName: 'PaymentRequests',
        timestamps: true
      }
    )
    return PaymentRequest
  }

  static associate(models: any) {
    models.PaymentRequest.belongsTo(models.User, { foreignKey: 'userId' })
    models.PaymentRequest.hasMany(models.PaymentRequestPayment, { foreignKey: 'paymentRequestId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentRequest.initModel(sequelize)
}
module.exports.PaymentRequest = PaymentRequest
module.exports.default = PaymentRequest
