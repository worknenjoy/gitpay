import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface ProjectAttributes {
  id: number
  name?: string | null
  repo?: string | null
  description?: string | null
  private?: boolean | null
  OrganizationId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  'id' | 'name' | 'repo' | 'description' | 'private' | 'OrganizationId' | 'createdAt' | 'updatedAt'
>

export default class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: number
  public name!: string | null
  public repo!: string | null
  public description!: string | null
  public private!: boolean | null
  public OrganizationId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Project {
    Project.init(
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
        repo: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        private: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        OrganizationId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Organizations',
            key: 'id'
          },
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
        tableName: 'Projects',
        timestamps: true
      }
    )
    return Project
  }

  static associate(models: any) {
    models.Project.hasMany(models.Task)
    models.Project.belongsTo(models.Organization)
    models.Project.belongsToMany(models.ProgrammingLanguage, {
      through: 'ProjectProgrammingLanguages',
      foreignKey: 'projectId',
      otherKey: 'programmingLanguageId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Project.initModel(sequelize)
}
module.exports.Project = Project
module.exports.default = Project
