module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Tasks', 'description', Sequelize.TEXT)
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Tasks', 'description')
  }
}
