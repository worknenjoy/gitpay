const { isAwaitKeyword } = require('typescript')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Plans', 'PlanSchemaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'PlanSchemas',
        key: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Plans', 'PlanSchemaId')
  }
}
