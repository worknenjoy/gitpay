import secrets from '../config/secrets'
import { Model, type ModelStatic, type Options, Sequelize } from 'sequelize'

import Assign from './assign'
import Coupon from './coupon'
import History from './history'
import Label from './label'
import Member from './member'
import Offer from './offer'
import Order from './order'
import Organization from './organization'
import PaymentRequest from './paymentRequest'
import PaymentRequestBalance from './paymentRequestBalance'
import PaymentRequestBalanceTransaction from './paymentRequestBalanceTransaction'
import PaymentRequestCustomer from './paymentRequestCustomer'
import PaymentRequestPayment from './paymentRequestPayment'
import PaymentRequestTransfer from './paymentRequestTransfer'
import Payout from './payout'
import Plan from './plan'
import PlanSchema from './planSchema'
import ProgrammingLanguage from './programminglanguage'
import Project from './project'
import ProjectProgrammingLanguage from './projectProgrammingLanguage'
import Role from './role'
import Task from './task'
import TaskSolution from './taskSolution'
import Transfer from './transfer'
import TypeModel from './type'
import User from './user'
import Wallet from './wallet'
import WalletOrder from './walletOrder'

type DatabaseEnvKey = 'development' | 'staging' | 'production' | 'test'

type DatabaseConnectionConfig = {
  username: string
  password: string | null
  database: string
} & Options

const env = (process.env.NODE_ENV || 'development') as DatabaseEnvKey | string

const databaseEnv: Record<DatabaseEnvKey, string> = {
  development: 'databaseDev',
  staging: 'databaseStaging',
  production: 'databaseProd',
  test: 'databaseTest'
}

const envKey: DatabaseEnvKey =
  env === 'production' || env === 'staging' || env === 'test' ? (env as DatabaseEnvKey) : 'development'

const secretsKey = databaseEnv[envKey]
const config = secrets[secretsKey as keyof typeof secrets]

let sequelize: Sequelize

if (env === 'production' || env === 'staging') {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required when NODE_ENV is production/staging')
  }

  sequelize = new Sequelize(databaseUrl, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
  // eslint-disable-next-line no-console
  console.log('running production migration')
} else {
  const dbConfig = config as unknown as DatabaseConnectionConfig
  const { database, username, password, ...options } = dbConfig
  sequelize = new Sequelize(database, username, password ?? undefined, options)
}

type ModelWithAssociate = ModelStatic<Model> & {
  associate?: (models: Record<string, any>) => void
}

type Db = Record<string, ModelWithAssociate> & {
  sequelize: Sequelize
  Sequelize: typeof Sequelize
}

const db = {} as Db

const models = [
  Assign,
  Coupon,
  History,
  Label,
  Member,
  Offer,
  Order,
  Organization,
  PaymentRequest,
  PaymentRequestBalance,
  PaymentRequestBalanceTransaction,
  PaymentRequestCustomer,
  PaymentRequestPayment,
  PaymentRequestTransfer,
  Payout,
  Plan,
  PlanSchema,
  ProgrammingLanguage,
  Project,
  ProjectProgrammingLanguage,
  Role,
  Task,
  TaskSolution,
  Transfer,
  TypeModel,
  User,
  Wallet,
  WalletOrder
] as const

for (const ModelClass of models) {
  const candidate = (ModelClass as any)?.default ?? (ModelClass as any)

  let model: ModelWithAssociate
  if (candidate && typeof candidate.initModel === 'function') {
    model = candidate.initModel(sequelize) as ModelWithAssociate
  } else if (typeof candidate === 'function') {
    // Backwards-compatible with the legacy CommonJS pattern:
    // `module.exports = (sequelize) => Model.initModel(sequelize)`
    model = candidate(sequelize) as ModelWithAssociate
  } else {
    const name = (candidate && (candidate.name || candidate.constructor?.name)) || 'UnknownModel'
    throw new TypeError(
      `Invalid model export for ${name}: expected a class with static initModel(sequelize) or a function (sequelize) => model.`
    )
  }

  db[model.name] = model
}

for (const modelName of Object.keys(db)) {
  const model = db[modelName]
  if (model?.associate) {
    model.associate(db)
  }
}

db.sequelize = sequelize
db.Sequelize = Sequelize

// Match the old CommonJS `module.exports = db` behavior so both
// `require('../models')` and `import models from '../models'` keep working.
export = db
