'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', { source: {
      type: Sequelize.STRING,
      unique: false
    } });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', { source: {
      type: Sequelize.STRING,
      unique: true
    } });
  }
};
