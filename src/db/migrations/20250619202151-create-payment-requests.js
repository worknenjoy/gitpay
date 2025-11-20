/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('PaymentRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      title: Sequelize.STRING,
      description: Sequelize.STRING,
      amount: Sequelize.DECIMAL,
      currency: Sequelize.STRING,
      payment_link_id: Sequelize.STRING,
      payment_url: Sequelize.STRING,
      status: {
        type: Sequelize.STRING,
        defaultValue: 'open',
      },
      transfer_status: {
        type: Sequelize.STRING,
        defaultValue: 'pending_payment',
      },
      transfer_id: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('PaymentRequests')
  },
}
