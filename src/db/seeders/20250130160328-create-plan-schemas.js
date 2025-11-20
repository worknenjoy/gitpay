/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'PlanSchemas',
      [
        {
          plan: 'open source',
          name: 'Open Source - default',
          description: 'Basic plan for open source',
          fee: 8,
          feeType: 'charge',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plan: 'open source',
          name: 'Open Source - no fee',
          description: 'Open source plan with no fee above $5000',
          fee: 0,
          createdAt: new Date(),
          feeType: 'charge',
          updatedAt: new Date(),
        },
        {
          plan: 'open source',
          name: 'Open Source - refund',
          description: 'Open source refunding fee',
          fee: 5,
          feeType: 'refund',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plan: 'private',
          name: 'Private - default',
          description: 'Plan for private issues',
          fee: 18,
          feeType: 'charge',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plan: 'private',
          name: 'Private - refund',
          description: 'Fee for refund private issues',
          fee: 5,
          feeType: 'refund',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('PlanSchemas', null, {})
  },
}
