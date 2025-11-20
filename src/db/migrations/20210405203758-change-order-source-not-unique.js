module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Orders', 'source', {
      type: Sequelize.STRING,
      unique: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Orders', 'source', {
      type: Sequelize.STRING,
      unique: true,
    })
  },
}
