'use strict'

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const path = require('path');
let Sequelize = require('sequelize');
let sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;