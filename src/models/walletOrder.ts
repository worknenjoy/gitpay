import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export type WalletOrderStatus =
  | 'pending'
  | 'draft'
  | 'open'
  | 'paid'
  | 'failed'
  | 'uncollectible'
  | 'void'
  | 'refunded'

export interface WalletOrderAttributes {
  id: number
  walletId: number
  source_id?: string | null
  currency?: string | null
  amount: string
  description?: string | null
  source_type?: string | null
  source?: string | null
  capture?: boolean | null
  ordered_in?: Date | null
  destination?: string | null
  paid?: boolean | null
  status: WalletOrderStatus
  createdAt?: Date
  updatedAt?: Date
}

export type WalletOrderCreationAttributes = Optional<
  WalletOrderAttributes,
  | 'id'
  | 'source_id'
  | 'currency'
  | 'description'
  | 'source_type'
  | 'source'
  | 'capture'
  | 'ordered_in'
  | 'destination'
  | 'paid'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
>

export default class WalletOrder
  extends Model<WalletOrderAttributes, WalletOrderCreationAttributes>
  implements WalletOrderAttributes
{
  public id!: number
  public walletId!: number
  public source_id!: string | null
  public currency!: string | null
  public amount!: string
  public description!: string | null
  public source_type!: string | null
  public source!: string | null
  public capture!: boolean | null
  public ordered_in!: Date | null
  public destination!: string | null
  public paid!: boolean | null
  public status!: WalletOrderStatus
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof WalletOrder {
    WalletOrder.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        walletId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        source_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: true
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: false
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
          unique: true,
          allowNull: true
        },
        capture: {
          type: DataTypes.BOOLEAN,
          allowNull: true
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
          allowNull: true
        },
        status: {
          type: DataTypes.ENUM(
            'pending',
            'draft',
            'open',
            'paid',
            'failed',
            'uncollectible',
            'void',
            'refunded'
          ),
          defaultValue: 'pending'
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
        tableName: 'WalletOrders',
        timestamps: true
      }
    )
    return WalletOrder
  }

  static associate(models: any) {
    models.WalletOrder.belongsTo(models.Wallet, {
      foreignKey: 'walletId'
    })
  }
}

module.exports = (sequelize: Sequelize) => {
  return WalletOrder.initModel(sequelize)
}
module.exports.WalletOrder = WalletOrder
module.exports.default = WalletOrder
