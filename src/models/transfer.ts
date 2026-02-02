import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface TransferAttributes {
  id: number
  status: string
  value?: string | null
  transfer_id?: string | null
  transfer_method?: string | null
  paypal_payout_id?: string | null
  paypal_transfer_amount?: string | null
  stripe_transfer_amount?: string | null
  taskId: number
  userId: number
  to: number
  createdAt?: Date
  updatedAt?: Date
}

export type TransferCreationAttributes = Optional<
  TransferAttributes,
  'id' | 'status' | 'value' | 'transfer_id' | 'transfer_method' | 'paypal_payout_id' | 'paypal_transfer_amount' | 'stripe_transfer_amount' | 'createdAt' | 'updatedAt'
>

export default class Transfer
  extends Model<TransferAttributes, TransferCreationAttributes>
  implements TransferAttributes
{
  public id!: number
  public status!: string
  public value!: string | null
  public transfer_id!: string | null
  public transfer_method!: string | null
  public paypal_payout_id!: string | null
  public paypal_transfer_amount!: string | null
  public stripe_transfer_amount!: string | null
  public taskId!: number
  public userId!: number
  public to!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Transfer {
    Transfer.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'pending'
        },
        value: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        transfer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        transfer_method: {
          type: DataTypes.STRING,
          allowNull: true
        },
        paypal_payout_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        paypal_transfer_amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        stripe_transfer_amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        taskId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Tasks',
            key: 'id'
          },
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          allowNull: false
        },
        to: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          allowNull: false
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
        tableName: 'Transfers',
        timestamps: true
      }
    )
    return Transfer
  }

  static associate(models: any) {
    models.Transfer.belongsTo(models.Task, {
      foreignKey: 'taskId'
    })
    models.Transfer.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User'
    })
    models.Transfer.belongsTo(models.User, { 
      foreignKey: 'to', 
      as: 'destination' 
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Transfer.initModel(sequelize)
}
module.exports.Transfer = Transfer
module.exports.default = Transfer
