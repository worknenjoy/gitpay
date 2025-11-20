module.exports = (sequelize, DataTypes) => {
  const ProgrammingLanguage = sequelize.define(
    'ProgrammingLanguage',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures no duplicate names
      },
    },
    {},
  )

  ProgrammingLanguage.associate = function (models) {
    ProgrammingLanguage.belongsToMany(models.Project, {
      through: 'ProjectProgrammingLanguages',
      foreignKey: 'programmingLanguageId',
      otherKey: 'projectId',
    })
  }

  return ProgrammingLanguage
}
