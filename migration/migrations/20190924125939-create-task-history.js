'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      fields: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      oldValues: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      newValues: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      TaskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Histories');
  }
};
