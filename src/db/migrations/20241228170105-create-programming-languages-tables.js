module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ProgrammingLanguages table
    await queryInterface.createTable('ProgrammingLanguages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })

    // Create ProjectProgrammingLanguages table
    await queryInterface.createTable('ProjectProgrammingLanguages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      programmingLanguageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProgrammingLanguages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Drop ProjectProgrammingLanguages table first due to foreign key dependency
    await queryInterface.dropTable('ProjectProgrammingLanguages')

    // Drop ProgrammingLanguages table
    await queryInterface.dropTable('ProgrammingLanguages')
  },
}
