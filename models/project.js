module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    repo: DataTypes.STRING,
    description: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    OrganizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Organizations',
        key: 'id'
      },
      allowNull: true,
    }
  }, {
    classMethods: {
      associate: (models) => {
        Project.hasMany(models.Task)
        Project.belongsTo(models.Organization)
      }
    },
    instanceMethods: {

    }
  })
  return Project
}
