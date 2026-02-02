import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface RoleAttributes {
  id: number
  name?: string | null
  label?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type RoleCreationAttributes = Optional<
  RoleAttributes,
  'id' | 'name' | 'label' | 'createdAt' | 'updatedAt'
>

export default class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number
  public name!: string | null
  public label!: string | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Role {
    Role.init(
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
        tableName: 'Roles',
        timestamps: true
      }
    )
    return Role
  }
}

module.exports = (sequelize: Sequelize) => {
  return Role.initModel(sequelize)
}
module.exports.Role = Role
module.exports.default = Role
