import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface CouponAttributes {
  id: number
  code?: string | null
  amount?: string | null
  expires?: boolean | null
  validUntil?: Date | null
  times?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type CouponCreationAttributes = Optional<
  CouponAttributes,
  'id' | 'code' | 'amount' | 'expires' | 'validUntil' | 'times' | 'createdAt' | 'updatedAt'
>

export default class Coupon
  extends Model<CouponAttributes, CouponCreationAttributes>
  implements CouponAttributes
{
  public id!: number
  public code!: string | null
  public amount!: string | null
  public expires!: boolean | null
  public validUntil!: Date | null
  public times!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Coupon {
    Coupon.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: DataTypes.STRING,
          allowNull: true
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        expires: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        validUntil: {
          type: DataTypes.DATE,
          allowNull: true
        },
        times: {
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
        tableName: 'Coupons',
        timestamps: true
      }
    )
    return Coupon
  }

  static associate(models: any) {
    models.Coupon.hasMany(models.Order, { foreignKey: 'couponId' })
  }
}

module.exports = (sequelize: Sequelize) => {
  return Coupon.initModel(sequelize)
}
module.exports.Coupon = Coupon
module.exports.default = Coupon
