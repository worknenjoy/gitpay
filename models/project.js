module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    name: DataTypes.STRING,
    repo: DataTypes.STRING,
    description: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    OrganizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Organizations",
        key: "id",
      },
      allowNull: true,
    },
    lastLanguageSync: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Timestamp of last programming languages sync from GitHub",
    },
    languageHash: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: "MD5 hash of current programming languages for change detection",
    },
    languageEtag: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "ETag from GitHub API for conditional requests",
    },
  });

  Project.associate = (models) => {
    Project.hasMany(models.Task);
    Project.belongsTo(models.Organization);
    Project.belongsToMany(models.ProgrammingLanguage, {
      through: "ProjectProgrammingLanguages",
      foreignKey: "projectId",
      otherKey: "programmingLanguageId",
    });
  };

  return Project;
};
