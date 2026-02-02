import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface LabelAttributes {
  id: number
  name?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type LabelCreationAttributes = Optional<
  LabelAttributes,
  'id' | 'name' | 'createdAt' | 'updatedAt'
>

export default class Label
  extends Model<LabelAttributes, LabelCreationAttributes>
  implements LabelAttributes
{
  public id!: number
  public name!: string | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Label {
    Label.init(
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
        tableName: 'Labels',
        timestamps: true
      }
    )
    return Label
  }

  static associate(models: any) {
    models.Label.belongsToMany(models.Task, {
      allowNull: false,
      foreignKey: 'labelId',
      otherKey: 'taskId',
      through: 'TaskLabels',
      onUpdate: 'cascade',
      onDelete: 'cascade',
      hooks: true
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Label.initModel(sequelize)
}
module.exports.Label = Label
module.exports.default = Label
