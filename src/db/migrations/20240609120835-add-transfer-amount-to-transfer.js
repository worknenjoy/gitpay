/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Transfers', 'paypal_transfer_amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    })
    await queryInterface.addColumn('Transfers', 'stripe_transfer_amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Transfers', 'paypal_transfer_amount')
    queryInterface.removeColumn('Transfers', 'stripe_transfer_amount')
  }
}
