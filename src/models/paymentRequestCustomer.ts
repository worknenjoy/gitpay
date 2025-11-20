import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PaymentRequestCustomerAttributes {
  id: number
  name?: string | null
  email: string
  sourceId: string
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentRequestCustomerCreationAttributes = Optional<
  PaymentRequestCustomerAttributes,
  'id' | 'name' | 'createdAt' | 'updatedAt'
>

export default class PaymentRequestCustomer
  extends Model<PaymentRequestCustomerAttributes, PaymentRequestCustomerCreationAttributes>
  implements PaymentRequestCustomerAttributes
{
  public id!: number
  public name!: string | null
  public email!: string
  public sourceId!: string
  public userId!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentRequestCustomer {
    PaymentRequestCustomer.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        sourceId: {
          type: DataTypes.STRING,
          allowNull: false
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
        tableName: 'PaymentRequestCustomers',
        timestamps: true
      }
    )
    return PaymentRequestCustomer
  }

  static associate(models: any) {
    // PaymentRequestCustomer has many PaymentRequestPayments
    models.PaymentRequestCustomer.hasMany(models.PaymentRequestPayment, {
      as: 'payments',
      foreignKey: 'customerId',
      sourceKey: 'id'
    })

    // PaymentRequestCustomer belongs to User
    models.PaymentRequestCustomer.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentRequestCustomer.initModel(sequelize)
}
module.exports.PaymentRequestCustomer = PaymentRequestCustomer
module.exports.default = PaymentRequestCustomer
