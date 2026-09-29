/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'PaymentLinkTypes',
      [
        {
          name: 'default',
          label: 'Default',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'pull_request',
          label: 'Pull Request',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentLinkTypes', { name: ['default', 'pull_request'] }, {})
  }
}
