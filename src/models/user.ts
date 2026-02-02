import { Model, DataTypes, Optional, Sequelize } from 'sequelize'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

export interface UserAttributes {
  id: number
  login_strategy: string
  provider?: string | null
  provider_id?: string | null
  provider_username?: string | null
  provider_email?: string | null
  email?: string | null
  email_verified?: boolean | null
  pending_email_change?: string | null
  email_change_token?: string | null
  email_change_token_expires_at?: Date | null
  email_change_requested_at?: Date | null
  email_change_attempts?: number | null
  password?: string | null
  name?: string | null
  username?: string | null
  website?: string | null
  repos?: string | null
  language?: string | null
  country?: string | null
  profile_url?: string | null
  picture_url?: string | null
  customer_id?: string | null
  account_id?: string | null
  paypal_id?: string | null
  os?: string | null
  skills?: string | null
  languages?: string | null
  recover_password_token?: string | null
  activation_token?: string | null
  receiveNotifications: boolean
  openForJobs: boolean
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'login_strategy' | 'provider' | 'provider_id' | 'provider_username' | 'provider_email' | 'email' | 'email_verified' | 'pending_email_change' | 'email_change_token' | 'email_change_token_expires_at' | 'email_change_requested_at' | 'email_change_attempts' | 'password' | 'name' | 'username' | 'website' | 'repos' | 'language' | 'country' | 'profile_url' | 'picture_url' | 'customer_id' | 'account_id' | 'paypal_id' | 'os' | 'skills' | 'languages' | 'recover_password_token' | 'activation_token' | 'receiveNotifications' | 'openForJobs' | 'active' | 'createdAt' | 'updatedAt'
>

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public login_strategy!: string
  public provider!: string | null
  public provider_id!: string | null
  public provider_username!: string | null
  public provider_email!: string | null
  public email!: string | null
  public email_verified!: boolean | null
  public pending_email_change!: string | null
  public email_change_token!: string | null
  public email_change_token_expires_at!: Date | null
  public email_change_requested_at!: Date | null
  public email_change_attempts!: number | null
  public password!: string | null
  public name!: string | null
  public username!: string | null
  public website!: string | null
  public repos!: string | null
  public language!: string | null
  public country!: string | null
  public profile_url!: string | null
  public picture_url!: string | null
  public customer_id!: string | null
  public account_id!: string | null
  public paypal_id!: string | null
  public os!: string | null
  public skills!: string | null
  public languages!: string | null
  public recover_password_token!: string | null
  public activation_token!: string | null
  public receiveNotifications!: boolean
  public openForJobs!: boolean
  public active!: boolean
  public createdAt!: Date
  public updatedAt!: Date

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        login_strategy: {
          type: DataTypes.STRING,
          defaultValue: 'local'
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: true
        },
        provider_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        provider_username: {
          type: DataTypes.STRING,
          allowNull: true
        },
        provider_email: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        pending_email_change: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email_change_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email_change_token_expires_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        email_change_requested_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        email_change_attempts: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        username: {
          type: DataTypes.STRING,
          allowNull: true
        },
        website: {
          type: DataTypes.STRING,
          allowNull: true
        },
        repos: {
          type: DataTypes.STRING,
          allowNull: true
        },
        language: {
          type: DataTypes.STRING,
          allowNull: true
        },
        country: {
          type: DataTypes.STRING,
          allowNull: true
        },
        profile_url: {
          type: DataTypes.STRING,
          allowNull: true
        },
        picture_url: {
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
        os: {
          type: DataTypes.STRING,
          allowNull: true
        },
        skills: {
          type: DataTypes.STRING,
          allowNull: true
        },
        languages: {
          type: DataTypes.STRING,
          allowNull: true
        },
        recover_password_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        activation_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        receiveNotifications: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        openForJobs: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
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
        tableName: 'Users',
        timestamps: true
      }
    )
    return User
  }

  static associate(models: any) {
    models.User.hasMany(models.Organization)
    models.User.hasMany(models.Payout, { foreignKey: 'userId' })
    models.User.belongsToMany(models.Type, { through: 'User_Types' })
  }

  static generateHash(password: string): string {
    /* eslint-disable no-sync */
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

  static generateToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  verifyPassword(password: string, databasePassword: string): boolean {
    return bcrypt.compareSync(password, databasePassword)
  }
}

module.exports = (sequelize: Sequelize) => {
  return User.initModel(sequelize)
}
module.exports.User = User
module.exports.default = User
