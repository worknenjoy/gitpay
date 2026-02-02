import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface OrganizationAttributes {
  id: number
  provider?: string | null
  email?: string | null
  private: boolean
  name?: string | null
  description?: string | null
  website?: string | null
  repo?: string | null
  country?: string | null
  image?: string | null
  customer_id?: string | null
  account_id?: string | null
  paypal_id?: string | null
  UserId?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export type OrganizationCreationAttributes = Optional<
  OrganizationAttributes,
  'id' | 'provider' | 'email' | 'private' | 'name' | 'description' | 'website' | 'repo' | 'country' | 'image' | 'customer_id' | 'account_id' | 'paypal_id' | 'UserId' | 'createdAt' | 'updatedAt'
>

export default class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes
{
  public id!: number
  public provider!: string | null
  public email!: string | null
  public private!: boolean
  public name!: string | null
  public description!: string | null
  public website!: string | null
  public repo!: string | null
  public country!: string | null
  public image!: string | null
  public customer_id!: string | null
  public account_id!: string | null
  public paypal_id!: string | null
  public UserId!: number | null
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof Organization {
    Organization.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true
        },
        private: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        website: {
          type: DataTypes.STRING,
          allowNull: true
        },
        repo: {
          type: DataTypes.STRING,
          allowNull: true
        },
        country: {
          type: DataTypes.STRING,
          allowNull: true
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true
        },
        customer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        account_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        paypal_id: {
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
        tableName: 'Organizations',
        timestamps: true
      }
    )
    return Organization
  }

  static associate(models: any) {
    models.Organization.belongsTo(models.User)
    models.Organization.hasMany(models.Project)
  }
}

module.exports = (sequelize: Sequelize) => {
  return Organization.initModel(sequelize)
}
module.exports.Organization = Organization
module.exports.default = Organization
