import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface TypeAttributes {
  id: number
  name?: string | null
  label?: string | null
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type TypeCreationAttributes = Optional<
  TypeAttributes,
  'id' | 'name' | 'label' | 'description' | 'createdAt' | 'updatedAt'
>

export default class Type
  extends Model<TypeAttributes, TypeCreationAttributes>
  implements TypeAttributes
{
  public id!: number
  public name!: string | null
  public label!: string | null
  public description!: string | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Type {
    Type.init(
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
        label: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
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
        tableName: 'Types',
        timestamps: true
      }
    )
    return Type
  }

  static associate(models: any) {
    models.Type.belongsToMany(models.User, { through: 'User_Types' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Type.initModel(sequelize)
}
module.exports.Type = Type
module.exports.default = Type
