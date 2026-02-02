import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface OrderAttributes {
  id: number
  source_id?: string | null
  provider?: string | null
  currency?: string | null
  amount?: string | null
  description?: string | null
  source_type?: string | null
  source?: string | null
  payment_url?: string | null
  payer_id?: string | null
  token?: string | null
  authorization_id?: string | null
  transfer_id?: string | null
  transfer_group?: string | null
  status: string
  capture: boolean
  ordered_in?: Date | null
  destination?: string | null
  paid: boolean
  userId?: number | null
  TaskId?: number | null
  taskId?: number | null
  couponId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  'id' | 'source_id' | 'provider' | 'currency' | 'amount' | 'description' | 'source_type' | 'source' | 'payment_url' | 'payer_id' | 'token' | 'authorization_id' | 'transfer_id' | 'transfer_group' | 'status' | 'capture' | 'ordered_in' | 'destination' | 'paid' | 'userId' | 'TaskId' | 'taskId' | 'couponId' | 'createdAt' | 'updatedAt'
>

export default class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number
  public source_id!: string | null
  public provider!: string | null
  public currency!: string | null
  public amount!: string | null
  public description!: string | null
  public source_type!: string | null
  public source!: string | null
  public payment_url!: string | null
  public payer_id!: string | null
  public token!: string | null
  public authorization_id!: string | null
  public transfer_id!: string | null
  public transfer_group!: string | null
  public status!: string
  public capture!: boolean
  public ordered_in!: Date | null
  public destination!: string | null
  public paid!: boolean
  public userId!: number | null
  public TaskId!: number | null
  public taskId!: number | null
  public couponId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Order {
    const { comment } = require('../modules/bot/comment')
    
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        source_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: true
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: true
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        source_type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        source: {
          type: DataTypes.STRING,
          allowNull: true
        },
        payment_url: {
          type: DataTypes.STRING,
          allowNull: true
        },
        payer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        authorization_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        transfer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        transfer_group: {
          type: DataTypes.STRING,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'open'
        },
        capture: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        ordered_in: {
          type: DataTypes.DATE,
          allowNull: true
        },
        destination: {
          type: DataTypes.STRING,
          allowNull: true
        },
        paid: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
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
        tableName: 'Orders',
        timestamps: true,
        hooks: {
          afterUpdate: async (instance: Order, options: any) => {
            if (instance.paid) {
              const taskId = instance.TaskId || instance.taskId
              if (taskId) {
                const task = await sequelize.models.Task.findByPk(taskId)
                if (task) {
                  await comment(instance, task)
                }
              }
            }
          }
        }
      }
    )
    return Order
  }

  static associate(models: any) {
    models.Order.belongsTo(models.User, { foreignKey: 'userId' })
    models.Order.belongsTo(models.Task, { foreignKey: 'TaskId' })
    models.Order.hasOne(models.Plan, { foreignKey: 'OrderId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Order.initModel(sequelize)
}
module.exports.Order = Order
module.exports.default = Order
