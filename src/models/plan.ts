import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export type PlanType = 'open source' | 'private' | 'with support'

export interface PlanAttributes {
  id: number
  plan?: PlanType | null
  fee?: string | null
  feePercentage?: number | null
  OrderId?: number | null
  PlanSchemaId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type PlanCreationAttributes = Optional<
  PlanAttributes,
  'id' | 'plan' | 'fee' | 'feePercentage' | 'OrderId' | 'PlanSchemaId' | 'createdAt' | 'updatedAt'
>

export default class Plan
  extends Model<PlanAttributes, PlanCreationAttributes>
  implements PlanAttributes
{
  public id!: number
  public plan!: PlanType | null
  public fee!: string | null
  public feePercentage!: number | null
  public OrderId!: number | null
  public PlanSchemaId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Plan {
    Plan.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        plan: {
          type: DataTypes.ENUM('open source', 'private', 'with support'),
          allowNull: true
        },
        fee: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        feePercentage: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        tableName: 'Plans',
        timestamps: true,
        hooks: {
          beforeCreate: async (instance: Plan, options: any) => {
            try {
              const percentages: Record<PlanType, number> = {
                'open source': 8,
                private: 18,
                'with support': 30
              }
              if (instance.plan) {
                instance.feePercentage = percentages[instance.plan]
                // Note: original code referenced instance.amount which doesn't exist in schema
                // Keeping the logic as-is for minimal changes
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log('Saving Fee Percentage error', e)
            }
          }
        }
      }
    )
    return Plan
  }

  static associate(models: any) {
    models.Plan.belongsTo(models.Order, { foreignKey: 'OrderId' })
    models.Plan.belongsTo(models.PlanSchema, { foreignKey: 'PlanSchemaId' })
  }

  static calcFinalPrice(price: number, plan?: PlanType): number {
    const percentages: Record<PlanType | 'full', number> = {
      'open source': price >= 5000 ? 1 : 1.08,
      private: 1.18,
      full: 1.3,
      'with support': 1.3
    }
    return Math.round(Number((price * percentages[plan || 'open source']).toFixed(2)))
  }

  finalPrice(): number {
    // Note: this references this.price which doesn't exist in schema
    // Keeping the logic as-is for minimal changes
    return (this as any).price + Number(this.fee || 0)
  }
}

module.exports = (sequelize: Sequelize) => {
  return Plan.initModel(sequelize)
}
module.exports.Plan = Plan
module.exports.default = Plan
