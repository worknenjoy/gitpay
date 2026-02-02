import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PaymentRequestTransferAttributes {
  id: number
  status: string
  value?: string | null
  transfer_id?: string | null
  transfer_method?: string | null
  paymentRequestId: number
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentRequestTransferCreationAttributes = Optional<
  PaymentRequestTransferAttributes,
  'id' | 'status' | 'value' | 'transfer_id' | 'transfer_method' | 'createdAt' | 'updatedAt'
>

export default class PaymentRequestTransfer
  extends Model<PaymentRequestTransferAttributes, PaymentRequestTransferCreationAttributes>
  implements PaymentRequestTransferAttributes
{
  public id!: number
  public status!: string
  public value!: string | null
  public transfer_id!: string | null
  public transfer_method!: string | null
  public paymentRequestId!: number
  public userId!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentRequestTransfer {
    PaymentRequestTransfer.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'pending'
        },
        value: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        transfer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        transfer_method: {
          type: DataTypes.STRING,
          allowNull: true
        },
        paymentRequestId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'PaymentRequests',
            key: 'id'
          },
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
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
        tableName: 'PaymentRequestTransfers',
        timestamps: true
      }
    )
    return PaymentRequestTransfer
  }

  static associate(models: any) {
    models.PaymentRequestTransfer.belongsTo(models.PaymentRequest, {
      foreignKey: 'paymentRequestId'
    })
    models.PaymentRequestTransfer.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentRequestTransfer.initModel(sequelize)
}
module.exports.PaymentRequestTransfer = PaymentRequestTransfer
module.exports.default = PaymentRequestTransfer
