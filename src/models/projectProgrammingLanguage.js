module.exports = (sequelize, DataTypes) => {
  const ProjectProgrammingLanguage = sequelize.define('ProjectProgrammingLanguage', {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
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
  })

  return ProjectProgrammingLanguage
}
