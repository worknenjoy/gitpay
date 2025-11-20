module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Offers', 'comment', {
      type: Sequelize.STRING(1000),
      unique: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Offers', 'comment', {
      type: Sequelize.STRING,
      unique: true
    })
  }
}
