'use strict';

const User = require('./user');

const Company = this.sequelize.define('company', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  website: Sequelize.STRING,
  picture_url: Sequelize.STRING
});

const Tag = this.sequelize.define('tag', {
  name: Sequelize.STRING
});

const Category = this.sequelize.define('category', {
  name: Sequelize.STRING
});

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    provider: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    level: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'OPEN'
    },
    stack: DataTypes.ARRAY,
    payment_method: DataTypes.STRING,
    dod: DataTypes.ARRAY,
    category: DataTypes.STRING,
    url: DataTypes.STRING,
    picture_url: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    assign: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Task.belongsTo(User);
        Task.hasOne(Company);
        Task.hasOne(Category);
        Task.hasMany(Tag);
      }
    },
    instanceMethods: {

    }
  });
  return Task;
};
