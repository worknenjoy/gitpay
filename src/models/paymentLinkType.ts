import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PaymentLinkTypeAttributes {
  id: number
  name: string
  label?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentLinkTypeCreationAttributes = Optional<
  PaymentLinkTypeAttributes,
  'id' | 'label' | 'createdAt' | 'updatedAt'
>

export default class PaymentLinkType
  extends Model<PaymentLinkTypeAttributes, PaymentLinkTypeCreationAttributes>
  implements PaymentLinkTypeAttributes
{
  public id!: number
  public name!: string
  public label!: string | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PaymentLinkType {
    PaymentLinkType.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        label: {
          type: DataTypes.STRING,
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
        tableName: 'PaymentLinkTypes',
        timestamps: true
      }
    )
    return PaymentLinkType
  }

  static associate(models: any) {
    models.PaymentLinkType.hasMany(models.PaymentRequest, { foreignKey: 'typeId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return PaymentLinkType.initModel(sequelize)
}
module.exports.PaymentLinkType = PaymentLinkType
module.exports.default = PaymentLinkType
