import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface AssignAttributes {
  id: number
  status: string
  message?: string | null
  userId?: number | null
  TaskId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type AssignCreationAttributes = Optional<
  AssignAttributes,
  'id' | 'status' | 'message' | 'userId' | 'TaskId' | 'createdAt' | 'updatedAt'
>

export default class Assign
  extends Model<AssignAttributes, AssignCreationAttributes>
  implements AssignAttributes
{
  public id!: number
  public status!: string
  public message!: string | null
  public userId!: number | null
  public TaskId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Assign {
    Assign.init(
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
        message: {
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
        tableName: 'Assigns',
        timestamps: true
      }
    )
    return Assign
  }

  static associate(models: any) {
    models.Assign.belongsTo(models.User, { foreignKey: 'userId' })
    models.Assign.belongsTo(models.Task, { foreignKey: 'TaskId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Assign.initModel(sequelize)
}
module.exports.Assign = Assign
module.exports.default = Assign
