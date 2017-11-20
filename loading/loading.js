'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const database_env = {
  'development': 'databaseDev',
  'production': 'databaseProd',
  'test': 'databaseTest'
};
const config = require('../config/secrets')[database_env[env]];

let Sequelize = require('sequelize');
let sequelize = {};

if (env == 'production') {
  const database_url = process.env.DATABASE_URL;
  const database_settings = database_url.split(':');
  const port = database_settings[4];
  const host = database_settings[3];
  sequelize = new Sequelize(database_url, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     port,
    host:     host,
    logging:  true //false
  });
  console.log('running production migration');

} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let db = {};

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
