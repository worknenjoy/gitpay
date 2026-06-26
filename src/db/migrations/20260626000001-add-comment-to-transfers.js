/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transfers', 'comment', {
      type: Sequelize.TEXT,
      allowNull: true
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Transfers', 'comment')
  }
}
