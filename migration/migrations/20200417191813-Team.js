'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teamname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      members: {
        type: Sequelize.ARRAY({
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          },
          allowNull: false
        })
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
    return queryInterface.dropTable('Teams');
  }
};
