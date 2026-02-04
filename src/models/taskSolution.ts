import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface TaskSolutionAttributes {
  id: number
  pullRequestURL: string
  isAuthorOfPR: boolean
  isConnectedToGitHub: boolean
  isPRMerged: boolean
  isIssueClosed: boolean
  hasIssueReference: boolean
  taskId?: number | null
  userId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type TaskSolutionCreationAttributes = Optional<
  TaskSolutionAttributes,
  | 'id'
  | 'isAuthorOfPR'
  | 'isConnectedToGitHub'
  | 'isPRMerged'
  | 'isIssueClosed'
  | 'hasIssueReference'
  | 'taskId'
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
>

export default class TaskSolution
  extends Model<TaskSolutionAttributes, TaskSolutionCreationAttributes>
  implements TaskSolutionAttributes
{
  public id!: number
  public pullRequestURL!: string
  public isAuthorOfPR!: boolean
  public isConnectedToGitHub!: boolean
  public isPRMerged!: boolean
  public isIssueClosed!: boolean
  public hasIssueReference!: boolean
  public taskId!: number | null
  public userId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof TaskSolution {
    TaskSolution.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        pullRequestURL: {
          type: DataTypes.STRING,
          allowNull: false
        },
        isAuthorOfPR: {
          allowNull: false,
          defaultValue: false,
          type: DataTypes.BOOLEAN
        },
        isConnectedToGitHub: {
          allowNull: false,
          defaultValue: false,
          type: DataTypes.BOOLEAN
        },
        isPRMerged: {
          allowNull: false,
          defaultValue: false,
          type: DataTypes.BOOLEAN
        },
        isIssueClosed: {
          allowNull: false,
          defaultValue: false,
          type: DataTypes.BOOLEAN
        },
        hasIssueReference: {
          allowNull: false,
          defaultValue: false,
          type: DataTypes.BOOLEAN
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
        tableName: 'TaskSolutions',
        timestamps: true
      }
    )
    return TaskSolution
  }

  static associate(models: any) {
    models.TaskSolution.belongsTo(models.Task, { foreignKey: 'taskId' })
    models.TaskSolution.belongsTo(models.User, { foreignKey: 'userId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return TaskSolution.initModel(sequelize)
}
module.exports.TaskSolution = TaskSolution
module.exports.default = TaskSolution
