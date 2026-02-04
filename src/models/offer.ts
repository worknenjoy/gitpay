import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface OfferAttributes {
  id: number
  value?: string | null
  suggestedDate?: Date | null
  comment?: string | null
  learn: boolean
  status: string
  userId?: number | null
  taskId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type OfferCreationAttributes = Optional<
  OfferAttributes,
  | 'id'
  | 'value'
  | 'suggestedDate'
  | 'comment'
  | 'learn'
  | 'status'
  | 'userId'
  | 'taskId'
  | 'createdAt'
  | 'updatedAt'
>

export default class Offer
  extends Model<OfferAttributes, OfferCreationAttributes>
  implements OfferAttributes
{
  public id!: number
  public value!: string | null
  public suggestedDate!: Date | null
  public comment!: string | null
  public learn!: boolean
  public status!: string
  public userId!: number | null
  public taskId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Offer {
    Offer.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        value: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        suggestedDate: {
          type: DataTypes.DATE,
          allowNull: true
        },
        comment: {
          type: DataTypes.STRING(1000),
          allowNull: true
        },
        learn: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'pending'
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
        tableName: 'Offers',
        timestamps: true
      }
    )
    return Offer
  }

  static associate(models: any) {
    models.Offer.belongsTo(models.User, { foreignKey: 'userId' })
    models.Offer.belongsTo(models.Task, { foreignKey: 'taskId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Offer.initModel(sequelize)
}
module.exports.Offer = Offer
module.exports.default = Offer
