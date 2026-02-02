import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface HistoryAttributes {
  id: number
  type?: string | null
  fields?: string[] | null
  oldValues?: string[] | null
  newValues?: string[] | null
  TaskId: number
  createdAt?: Date
  updatedAt?: Date
}

export type HistoryCreationAttributes = Optional<
  HistoryAttributes,
  'id' | 'type' | 'fields' | 'oldValues' | 'newValues' | 'createdAt' | 'updatedAt'
>

export default class History
  extends Model<HistoryAttributes, HistoryCreationAttributes>
  implements HistoryAttributes
{
  public id!: number
  public type!: string | null
  public fields!: string[] | null
  public oldValues!: string[] | null
  public newValues!: string[] | null
  public TaskId!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof History {
    History.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        fields: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true
        },
        oldValues: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true
        },
        newValues: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true
        },
        TaskId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Tasks',
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
        tableName: 'Histories',
        timestamps: true
      }
    )
    return History
  }

  static associate(models: any) {
    models.History.belongsTo(models.Task)
  }
}

module.exports = (sequelize: Sequelize) => {
  return History.initModel(sequelize)
}
module.exports.History = History
module.exports.default = History
