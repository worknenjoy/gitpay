import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface ProgrammingLanguageAttributes {
  id: number
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export type ProgrammingLanguageCreationAttributes = Optional<
  ProgrammingLanguageAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export default class ProgrammingLanguage
  extends Model<ProgrammingLanguageAttributes, ProgrammingLanguageCreationAttributes>
  implements ProgrammingLanguageAttributes
{
  public id!: number
  public name!: string
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof ProgrammingLanguage {
    ProgrammingLanguage.init(
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
        tableName: 'ProgrammingLanguages',
        timestamps: true
      }
    )
    return ProgrammingLanguage
  }

  static associate(models: any) {
    models.ProgrammingLanguage.belongsToMany(models.Project, {
      through: 'ProjectProgrammingLanguages',
      foreignKey: 'programmingLanguageId',
      otherKey: 'projectId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return ProgrammingLanguage.initModel(sequelize)
}
module.exports.ProgrammingLanguage = ProgrammingLanguage
module.exports.default = ProgrammingLanguage
