import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface MemberAttributes {
  id: number
  roleId?: number | null
  userId?: number | null
  taskId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type MemberCreationAttributes = Optional<
  MemberAttributes,
  'id' | 'roleId' | 'userId' | 'taskId' | 'createdAt' | 'updatedAt'
>

export default class Member
  extends Model<MemberAttributes, MemberCreationAttributes>
  implements MemberAttributes
{
  public id!: number
  public roleId!: number | null
  public userId!: number | null
  public taskId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Member {
    Member.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        roleId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Roles',
            key: 'id'
          },
          allowNull: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        taskId: {
          type: DataTypes.INTEGER,
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
        tableName: 'Members',
        timestamps: true
      }
    )
    return Member
  }

  static associate(models: any) {
    models.Member.belongsTo(models.User, { foreignKey: 'userId' })
    models.Member.belongsTo(models.Task, { foreignKey: 'taskId' })
    models.Member.belongsTo(models.Role, { foreignKey: 'roleId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Member.initModel(sequelize)
}
module.exports.Member = Member
module.exports.default = Member
