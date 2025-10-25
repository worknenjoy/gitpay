'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: true
      },
      TaskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        allowNull: true
      },
      source_id: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      description: {
        type: Sequelize.STRING
      },
      source_type: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING,
        unique: true
      },
      status: {
        type: Sequelize.STRING
      },
      capture: {
        type: Sequelize.BOOLEAN
      },
      ordered_in: {
        type: Sequelize.DATE
      },
      destination: {
        type: Sequelize.STRING
      },
      paid: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Orders');
  }
};
