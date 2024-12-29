module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ProgrammingLanguages table
    await queryInterface.createTable('ProgrammingLanguages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create TaskProgrammingLanguages table
    await queryInterface.createTable('TaskProgrammingLanguages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      programmingLanguageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProgrammingLanguages',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop TaskProgrammingLanguages table first due to foreign key dependency
    await queryInterface.dropTable('TaskProgrammingLanguages');

    // Drop ProgrammingLanguages table
    await queryInterface.dropTable('ProgrammingLanguages');
  }
};
