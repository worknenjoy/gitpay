const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'

const databaseEnv = {
  'development': 'databaseDev',
  'production': 'databaseProd',
  'test': 'databaseTest'
}

const config = require('../config/secrets')[databaseEnv[env]]

let Sequelize = require('sequelize')
let sequelize = {}

if (env === 'production') {
  const databaseUrl = process.env.DATABASE_URL
  const databaseSettings = databaseUrl.split(':')
  const port = databaseSettings[4]
  const host = databaseSettings[3]
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    protocol: 'postgres',
    port: port,
    host: host,
    logging: true // false
  })
  // eslint-disable-next-line no-console
  console.log('running production migration')
}
else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

let db = {}

/* eslint-disable no-sync */
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
