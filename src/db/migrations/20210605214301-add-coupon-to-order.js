module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Orders', 'couponId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Coupons',
        key: 'id'
      },
      allowNull: true
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'couponId')
  }
}
