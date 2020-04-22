'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id'
        },
        allowNull: true
      },
      plan: {
        type: Sequelize.ENUM,
        values: ['open source', 'private', 'with support']
      },
      fee: {
        type: Sequelize.DECIMAL
      },
      feePercentage: {
        type: Sequelize.INTEGER
      },
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Plans');
  }
};
