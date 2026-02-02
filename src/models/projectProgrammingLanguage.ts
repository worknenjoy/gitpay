import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface ProjectProgrammingLanguageAttributes {
  id: number
  projectId: number
  programmingLanguageId: number
  createdAt?: Date
  updatedAt?: Date
}

export type ProjectProgrammingLanguageCreationAttributes = Optional<
  ProjectProgrammingLanguageAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export default class ProjectProgrammingLanguage
  extends Model<ProjectProgrammingLanguageAttributes, ProjectProgrammingLanguageCreationAttributes>
  implements ProjectProgrammingLanguageAttributes
{
  public id!: number
  public projectId!: number
  public programmingLanguageId!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof ProjectProgrammingLanguage {
    ProjectProgrammingLanguage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Projects',
            key: 'id'
          }
        },
        programmingLanguageId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'ProgrammingLanguages',
            key: 'id'
          }
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
        tableName: 'ProjectProgrammingLanguages',
        timestamps: true
      }
    )
    return ProjectProgrammingLanguage
  }
}

module.exports = (sequelize: Sequelize) => {
  return ProjectProgrammingLanguage.initModel(sequelize)
}
module.exports.ProjectProgrammingLanguage = ProjectProgrammingLanguage
module.exports.default = ProjectProgrammingLanguage
