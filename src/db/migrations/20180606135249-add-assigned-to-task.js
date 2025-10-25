'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Tasks',
      'assigned',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Assigns',
          key: 'id'
        },
        allowNull: true
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Tasks',
      'assigned'
    );
  }
};
