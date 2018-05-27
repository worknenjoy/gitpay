'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'account_id',
      Sequelize.STRING
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Users',
      'account_id'
    );
  }
};
