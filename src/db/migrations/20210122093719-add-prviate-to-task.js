module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Tasks', 'private', Sequelize.BOOLEAN)
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Tasks', 'private')
  }
}
