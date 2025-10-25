'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
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
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING
      },
      private: {
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      repo: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.STRING
      },
      account_id: {
        type: Sequelize.STRING
      },
      paypal_id: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Organizations');
  }
};
