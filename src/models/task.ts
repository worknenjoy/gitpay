import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface TaskAttributes {
  id: number
  private: boolean
  not_listed: boolean
  provider?: string | null
  description?: string | null
  type?: string | null
  level?: string | null
  status: string
  deadline?: Date | null
  url?: string | null
  title?: string | null
  value?: string | null
  paid: boolean
  notified: boolean
  transfer_id?: string | null
  assigned?: number | null
  TransferId?: number | null
  ProjectId?: number | null
  userId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type TaskCreationAttributes = Optional<
  TaskAttributes,
  'id' | 'private' | 'not_listed' | 'provider' | 'description' | 'type' | 'level' | 'status' | 'deadline' | 'url' | 'title' | 'value' | 'paid' | 'notified' | 'transfer_id' | 'assigned' | 'TransferId' | 'ProjectId' | 'userId' | 'createdAt' | 'updatedAt'
>

export default class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number
  public private!: boolean
  public not_listed!: boolean
  public provider!: string | null
  public description!: string | null
  public type!: string | null
  public level!: string | null
  public status!: string
  public deadline!: Date | null
  public url!: string | null
  public title!: string | null
  public value!: string | null
  public paid!: boolean
  public notified!: boolean
  public transfer_id!: string | null
  public assigned!: number | null
  public TransferId!: number | null
  public ProjectId!: number | null
  public userId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Task {
    Task.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        private: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        not_listed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        level: {
          type: DataTypes.STRING,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'open'
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: true
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true
        },
        value: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        paid: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        notified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        transfer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        assigned: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Assigns',
            key: 'id'
          },
          allowNull: true
        },
        TransferId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Transfers',
            key: 'id'
          },
          allowNull: true
        },
        ProjectId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Projects',
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
        tableName: 'Tasks',
        timestamps: true,
        hooks: {
          afterCreate: async (instance: Task, options: any) => {
            try {
              const changed = instance.changed()
              await sequelize.models.History.create({
                TaskId: instance.id,
                type: 'create',
                fields: changed,
                oldValues: Object.values(instance.previous()),
                newValues: changed ? (changed as string[]).map((v: string) => (instance as any).dataValues[v]) : []
              })
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log('Task History update error', e)
            }
          },
          afterUpdate: async (instance: Task, options: any) => {
            try {
              const changed = instance.changed()
              const previous = Object.values(instance.previous())
              const newValues = changed ? (changed as string[]).map((v: string) => `${(instance as any).dataValues[v]}`) : []
              if (
                JSON.stringify(previous) !== JSON.stringify(newValues) &&
                JSON.stringify(changed) !== JSON.stringify(['id', 'updatedAt']) &&
                JSON.stringify(changed) !== JSON.stringify(['value', 'updatedAt']) &&
                previous[0] !== 'null' &&
                newValues[0] !== '0'
              ) {
                await sequelize.models.History.create({
                  TaskId: instance.id,
                  type: 'update',
                  fields: changed,
                  oldValues: previous,
                  newValues: newValues
                })
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log('Task History update error', e)
            }
          }
        }
      }
    )
    return Task
  }

  static associate(models: any) {
    models.Task.belongsTo(models.Project)
    models.Task.belongsTo(models.User, { foreignKey: 'userId' })
    models.Task.hasMany(models.History, { foreignKey: 'TaskId' })
    models.Task.hasMany(models.Order, { foreignKey: 'TaskId' })
    models.Task.hasMany(models.Assign, { foreignKey: 'TaskId' })
    models.Task.hasMany(models.Offer, { foreignKey: 'taskId' })
    models.Task.hasMany(models.Member, { foreignKey: 'taskId' })
    models.Task.belongsToMany(models.Label, {
      foreignKey: 'taskId',
      allowNull: false,
      otherKey: 'labelId',
      through: 'TaskLabels',
      onUpdate: 'cascade',
      onDelete: 'cascade',
      hooks: true
    })
    models.Task.hasMany(models.TaskSolution, { foreignKey: 'taskId' })
    models.Task.hasOne(models.Transfer, { foreignKey: 'taskId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Task.initModel(sequelize)
}
module.exports.Task = Task
module.exports.default = Task
