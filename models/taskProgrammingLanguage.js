module.exports = (sequelize, DataTypes) => {
  const TaskProgrammingLanguage = sequelize.define('TaskProgrammingLanguage', {
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tasks',
        key: 'id'
      }
    },
    programmingLanguageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProgrammingLanguages',
        key: 'id'
      }
    }
  });

  return TaskProgrammingLanguage;
};