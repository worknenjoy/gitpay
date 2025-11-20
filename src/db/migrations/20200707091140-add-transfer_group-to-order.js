module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Orders', 'transfer_group', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'transfer_group')
  }
}
