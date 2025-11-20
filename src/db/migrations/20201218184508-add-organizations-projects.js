module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('organizations_projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganizationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id',
        },
        allowNull: false,
      },
      ProjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id',
        },
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('organizations_projects')
  },
}
