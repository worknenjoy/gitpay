import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface PlatformPublicStatsAttributes {
  id: number
  users_count?: number
  bounties_count?: number
  payment_requests_payments_count?: number
  payment_request_count?: number
  total_paid_for_bounties_count?: number
  total_paid_for_payment_requests_count?: number
  total_user_countries_count?: number
  slack_channel_users_count?: number
  createdAt?: Date
  updatedAt?: Date
}

export type PlatformPublicStatsCreationAttributes = Optional<
  PlatformPublicStatsAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export default class PlatformPublicStats
  extends Model<PlatformPublicStatsAttributes, PlatformPublicStatsCreationAttributes>
  implements PlatformPublicStatsAttributes
{
  public id!: number
  public users_count!: number
  public bounties_count!: number
  public payment_requests_payments_count!: number
  public payment_request_count!: number
  public total_paid_for_bounties_count!: number
  public total_paid_for_payment_requests_count!: number
  public total_user_countries_count!: number
  public slack_channel_users_count!: number
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof PlatformPublicStats {
    PlatformPublicStats.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        users_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        bounties_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        payment_requests_payments_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        payment_request_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        total_paid_for_bounties_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        total_paid_for_payment_requests_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        total_user_countries_count: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        slack_channel_users_count: {
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
        tableName: 'PlatformPublicStats',
        timestamps: true
      }
    )
    return PlatformPublicStats
  }

  static associate(_models: any) {}
}

module.exports = (sequelize: Sequelize) => {
  return PlatformPublicStats.initModel(sequelize)
}
module.exports.PlatformPublicStats = PlatformPublicStats
module.exports.default = PlatformPublicStats
