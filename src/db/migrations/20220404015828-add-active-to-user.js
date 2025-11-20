module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'active')
  }
}
