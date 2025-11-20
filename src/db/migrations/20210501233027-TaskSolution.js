module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TaskSolutions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pullRequestURL: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isAuthorOfPR: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isConnectedToGitHub: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isPRMerged: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isIssueClosed: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          key: 'id',
        },
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: true,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TaskSolutions')
  },
}
