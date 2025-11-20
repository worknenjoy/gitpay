module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Tasks', 'ProjectId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Projects',
        key: 'id',
      },
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Tasks', 'ProjectId')
  },
}
