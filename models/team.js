module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    teamname: DataTypes.STRING,
    members: {
      type: DataTypes.ARRAY({
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
        }
      })
    }

  }, {
    classMethods: {
      associate: (models) => {
        Team.hasMany(models.User)
      }
    },
    instanceMethods: {

    }
  })
  return Team
}
