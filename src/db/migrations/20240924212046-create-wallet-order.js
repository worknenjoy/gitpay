/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('WalletOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      walletId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Wallets',
          key: 'id',
        },
        allowNull: false,
      },
      source_id: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      description: {
        type: Sequelize.STRING,
      },
      source_type: {
        type: Sequelize.STRING,
      },
      source: {
        type: Sequelize.STRING,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'draft',
          'open',
          'paid',
          'failed',
          'uncollectible',
          'void',
          'refunded',
        ),
      },
      capture: {
        type: Sequelize.BOOLEAN,
      },
      ordered_in: {
        type: Sequelize.DATE,
      },
      destination: {
        type: Sequelize.STRING,
      },
      paid: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
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
    await queryInterface.dropTable('WalletOrders')
  },
}
