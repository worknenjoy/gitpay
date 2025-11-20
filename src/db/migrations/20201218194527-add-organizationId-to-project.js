module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Projects', 'OrganizationId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Organizations',
        key: 'id',
      },
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Projects', 'OrganizationId')
  },
}
