import path from 'path'
import child_process from 'child_process'
import { Umzug, SequelizeStorage } from 'umzug'
import { Sequelize } from 'sequelize'
import secrets from './config/secrets'

// ---------- ENV / SEQUELIZE SETUP ----------
const env = process.env.NODE_ENV || 'development'

const database_env = {
  development: 'databaseDev',
  staging: 'databaseStaging',
  production: 'databaseProd',
  test: 'databaseTest'
} as const

type EnvName = keyof typeof database_env
type SecretKey = (typeof database_env)[EnvName]

const config = (secrets as Record<SecretKey, any>)[database_env[env as EnvName]]

let sequelize: Sequelize

if (env === 'production' || env === 'staging') {
  const database_url = process.env.DATABASE_URL || ''
  const url = new URL(database_url)
  const port = parseInt(url.port || '5432', 10)
  const host = url.hostname

  sequelize = new Sequelize(database_url, {
    dialect: 'postgres',
    protocol: 'postgres',
    port,
    host,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })

  console.log('running production-like migration')
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

sequelize
  .query('SELECT current_database();')
  .then(([res]: any) => {
    console.log('✅ Connected to DB:', res[0].current_database)
  })

// are we running migrations or seeders?
const isSeed = process.env.TYPE === 'seed'

// IMPORTANT: paths
// When you run `tsx src/migrate.ts`, __dirname = <repo>/src
// When you run `node dist/migrate.js`, __dirname = <repo>/dist
// So `./db/migrations` works in both IF your migrations live under src/db/migrations
// and get compiled to dist/db/migrations.
const baseDir = isSeed
  ? path.join(__dirname, './db/seeders')
  : path.join(__dirname, './db/migrations')

// ---------- UMZUG SETUP (v3+) ----------

// We'll allow legacy and new migration styles in the same project.
// legacy: module.exports.up = (qi, SequelizeCtor) => {}
// new TS: export async function up({ queryInterface, SequelizeCtor }) {}
const umzug = new Umzug({
  context: {
    sequelize,
    queryInterface: sequelize.getQueryInterface(),
    SequelizeCtor: sequelize.constructor as typeof Sequelize
  },

  storage: new SequelizeStorage({ sequelize }),

  migrations: {
    // FIX 1: glob must be a string, not [string]
    glob: path.join(baseDir, '*.{ts,js}'),

    // For each file, build a migration object with up/down
    resolve: ({ name, path: filePath, context }) => {
      if (!filePath) {
        throw new Error(`Migration "${name}" is missing a file path`)
      }
      const mod = require(filePath)

      // Old style (CommonJS)
      //   module.exports = { up(qi, S) {}, down(qi, S) {} }
      // New style (TS/ESM-ish)
      //   export async function up(ctx) {}
      //   export async function down(ctx) {}
      const upRaw =
        mod.up ||
        (mod.default && mod.default.up)

      const downRaw =
        mod.down ||
        (mod.default && mod.default.down)

      if (!upRaw || !downRaw) {
        throw new Error(
          `Migration "${name}" in ${filePath} does not export up/down`
        )
      }

      // We normalize call signatures here.
      // If function expects 2 args, assume legacy (qi, SequelizeCtor)
      // Otherwise assume new-style (ctx object).
      const runUp = () => {
        if (upRaw.length >= 2) {
          return upRaw(
            context.queryInterface,
            context.SequelizeCtor
          )
        }
        return upRaw(context)
      }

      const runDown = () => {
        if (downRaw.length >= 2) {
          return downRaw(
            context.queryInterface,
            context.SequelizeCtor
          )
        }
        return downRaw(context)
      }

      return {
        name,
        up: runUp,
        down: runDown
      }
    }
  },

  // optional: you can silence this if you want
  logger: console
})

// ---------- COMMAND HELPERS ----------

async function cmdStatus() {
  const executed = await umzug.executed()
  const pending = await umzug.pending()

  // normalize for printing
  const norm = (list: { name: string }[]) =>
    list.map(m => ({
      name: m.name,
      file: m.name
    }))

  const status = {
    current: executed.length > 0 ? executed[0].name : '<NO_MIGRATIONS>',
    executed: executed.map(m => m.name),
    pending: pending.map(m => m.name)
  }

  console.log('Status:', JSON.stringify(status, null, 2))

  return {
    executed: norm(executed),
    pending: norm(pending)
  }
}

function cmdMigrate() {
  // run all pending
  return umzug.up()
}

async function cmdMigrateNext() {
  const { pending } = await cmdStatus()
  if (pending.length === 0) {
    throw new Error('No pending migrations')
  }
  const next = pending[0].name
  return umzug.up({ to: next })
}

// FIX 3: umzug.up({ from, to }) is not supported in v3
// We'll just run all pending (this is equivalent in most flows)
function cmdUpdateAll() {
  return umzug.up()
}

function cmdReset() {
  // go all the way down
  return umzug.down({ to: 0 })
}

async function cmdResetPrev() {
  const { executed } = await cmdStatus()
  if (executed.length === 0) {
    throw new Error('Already at initial state')
  }
  const prev = executed[executed.length - 1].name
  return umzug.down({ to: prev })
}

function cmdHardReset() {
  return new Promise<void>((resolve, reject) => {
    setImmediate(() => {
      try {
        console.log(`dropdb ${config.database}`)
        child_process.spawnSync(`dropdb ${config.database}`)
        console.log(`createdb ${config.database} --username ${config.username}`)
        child_process.spawnSync(`createdb ${config.database} --username ${config.username}`)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  })
}

// ---------- CLI DISPATCH ----------

// FIX 2: ensure cmd is always a string
const cmd = (process.argv[2] || 'up').trim()

async function run() {
  try {
    if (cmd === 'status') {
      await cmdStatus()
    } else if (cmd === 'up' || cmd === 'migrate') {
      await cmdMigrate()
    } else if (cmd === 'next' || cmd === 'migrate-next') {
      await cmdMigrateNext()
    } else if (cmd === 'down' || cmd === 'reset') {
      await cmdReset()
    } else if (cmd === 'prev' || cmd === 'reset-prev') {
      await cmdResetPrev()
    } else if (cmd === 'reset-hard') {
      await cmdHardReset()
    } else if (cmd === 'update') {
      await cmdUpdateAll()
    } else {
      console.log(`invalid cmd: ${cmd}`)
      process.exit(1)
    }

    const doneStr = `${cmd.toUpperCase()} DONE`
    console.log('='.repeat(doneStr.length))

    if (cmd !== 'status' && cmd !== 'reset-hard') {
      await cmdStatus()
    }

    process.exit(0)
  } catch (err) {
    const errorStr = `${cmd.toUpperCase()} ERROR`
    console.log('='.repeat(errorStr.length))
    console.error(err)
    console.log('='.repeat(errorStr.length))
    process.exit(1)
  }
}

run()
