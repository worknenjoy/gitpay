'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'skills',
      Sequelize.STRING
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Users',
      'skills'
    );
  }
};
