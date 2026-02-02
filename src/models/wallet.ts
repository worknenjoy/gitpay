import { Model, DataTypes, Optional, Sequelize } from 'sequelize'
import Decimal from 'decimal.js'

export interface WalletAttributes {
  id: number
  userId: number
  name?: string | null
  balance: string
  createdAt?: Date
  updatedAt?: Date
}

export type WalletCreationAttributes = Optional<
  WalletAttributes,
  'id' | 'name' | 'createdAt' | 'updatedAt'
>

export default class Wallet
  extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes
{
  public id!: number
  public userId!: number
  public name!: string | null
  public balance!: string
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Wallet {
    Wallet.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        balance: {
          type: DataTypes.DECIMAL,
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
        tableName: 'Wallets',
        timestamps: true,
        hooks: {
          afterFind: async (wallet: Wallet | Wallet[] | null, options: any) => {
            if (!wallet) return

            if (Array.isArray(wallet)) {
              // Handle findAll case
              for (const singleWallet of wallet) {
                await updateWalletBalance(singleWallet, options)
              }
            } else {
              // Handle findByPk or findOne case
              await updateWalletBalance(wallet, options)
            }
          }
        }
      }
    )

    // Helper function to update the balance of a wallet
    async function updateWalletBalance(wallet: Wallet, options: any) {
      const totalBalance = await wallet.totalBalance() // Calculate balance using your methods
      wallet.balance = totalBalance.toFixed(2) // Update the balance field in memory
      await wallet.save({
        transaction: options.transaction
      }) // Persist the updated balance to the database (optional)
    }

    return Wallet
  }

  static associate(models: any) {
    models.Wallet.hasMany(models.WalletOrder, {
      foreignKey: 'walletId'
    })
    models.Wallet.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  async addBalance(): Promise<Decimal> {
    const sequelize = this.sequelize
    if (!sequelize) throw new Error('Sequelize instance not found')
    
    const orders = await sequelize.models.WalletOrder.findAll({
      where: {
        walletId: this.id,
        status: 'paid'
      }
    })
    const balance = orders.reduce((acc: Decimal, order: any) => {
      return acc.plus(order.amount)
    }, new Decimal(0))
    return balance
  }

  async spendBalance(): Promise<Decimal> {
    const sequelize = this.sequelize
    if (!sequelize) throw new Error('Sequelize instance not found')
    
    const orders = await sequelize.models.Order.findAll({
      where: {
        provider: 'wallet',
        source_type: 'wallet-funds',
        source_id: `${this.id}`,
        status: 'succeeded'
      }
    })
    const balance = orders.reduce((acc: Decimal, order: any) => {
      const fee = order.amount >= 5000 ? 1 : 1.08
      return acc.plus(order.amount * fee)
    }, new Decimal(0))
    return balance
  }

  async totalBalance(): Promise<Decimal> {
    const totalAddedBalance = await this.addBalance()
    const addedBalance = new Decimal(totalAddedBalance)
    return addedBalance.minus(await this.spendBalance())
  }
}

module.exports = (sequelize: Sequelize) => {
  return Wallet.initModel(sequelize)
}
module.exports.Wallet = Wallet
module.exports.default = Wallet
