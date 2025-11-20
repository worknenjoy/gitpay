module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'provider_username', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'provider_username')
  }
}
