import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PayoutAttributes {
  id: number
  source_id?: string | null
  method?: string | null
  amount?: string | null
  currency: string
  description?: string | null
  status: string
  paid: boolean
  userId: number
  arrival_date?: string | null
  reference_number?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type PayoutCreationAttributes = Optional<
  PayoutAttributes,
  | 'id'
  | 'source_id'
  | 'method'
  | 'amount'
  | 'currency'
  | 'description'
  | 'status'
  | 'paid'
  | 'arrival_date'
  | 'reference_number'
  | 'createdAt'
  | 'updatedAt'
>

export default class Payout
  extends Model<PayoutAttributes, PayoutCreationAttributes>
  implements PayoutAttributes
{
  public id!: number
  public source_id!: string | null
  public method!: string | null
  public amount!: string | null
  public currency!: string
  public description!: string | null
  public status!: string
  public paid!: boolean
  public userId!: number
  public arrival_date!: string | null
  public reference_number!: string | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Payout {
    Payout.init(
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
        method: {
          type: DataTypes.STRING,
          allowNull: true
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        currency: {
          type: DataTypes.STRING,
          defaultValue: 'usd'
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'initiated'
        },
        paid: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          allowNull: false
        },
        arrival_date: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        reference_number: {
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
        tableName: 'Payouts',
        timestamps: true
      }
    )
    return Payout
  }

  static associate(models: any) {
    models.Payout.belongsTo(models.User, { foreignKey: 'userId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Payout.initModel(sequelize)
}
module.exports.Payout = Payout
module.exports.default = Payout
