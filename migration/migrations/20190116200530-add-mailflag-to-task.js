'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Tasks',
      'notified',
      Sequelize.STRING
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Tasks',
      'notified'
    );
  }
};
