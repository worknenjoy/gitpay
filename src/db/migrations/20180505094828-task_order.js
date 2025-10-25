'use strict';

/*
*
* Not being used, just to use as reference to any other many to many relation
*
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('task_orders',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        taskId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Tasks',
            key: 'id'
          },
          allowNull: false
        },
        orderId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Orders',
            key: 'id'
          },
          allowNull: true
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      }
    )},
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('task_orders')
  }
};
