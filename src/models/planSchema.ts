import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export type FeeType = 'charge' | 'refund'

export interface PlanSchemaAttributes {
  id: number
  name?: string | null
  description?: string | null
  fee?: string | null
  feeType?: FeeType | null
  createdAt?: Date
  updatedAt?: Date
}

export type PlanSchemaCreationAttributes = Optional<
  PlanSchemaAttributes,
  'id' | 'name' | 'description' | 'fee' | 'feeType' | 'createdAt' | 'updatedAt'
>

export default class PlanSchema
  extends Model<PlanSchemaAttributes, PlanSchemaCreationAttributes>
  implements PlanSchemaAttributes
{
  public id!: number
  public name!: string | null
  public description!: string | null
  public fee!: string | null
  public feeType!: FeeType | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PlanSchema {
    PlanSchema.init(
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
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        fee: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        feeType: {
          type: DataTypes.ENUM('charge', 'refund'),
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
        tableName: 'PlanSchemas',
        timestamps: true
      }
    )
    return PlanSchema
  }
}

module.exports = (sequelize: Sequelize) => {
  return PlanSchema.initModel(sequelize)
}
module.exports.PlanSchema = PlanSchema
module.exports.default = PlanSchema
