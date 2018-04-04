'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
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
        allowNull: false
      },
      provider: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      stack: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      dod: {
        type: Sequelize.STRING
      },
      deadline: {
        type: Sequelize.DATE
      },
      url: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.DECIMAL
      },
      paid: {
        type: Sequelize.BOOLEAN
      },
      assign: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Tasks');
  }
};
