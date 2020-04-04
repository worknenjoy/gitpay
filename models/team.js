module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    teamname: DataTypes.STRING,
    members : [ {
      member: {
        type: DataTypes.INTEGER,
        references:{
          model: 'User',
          key: 'id'
        }
      }
    } ], 
  }, {
    classMethods: {
      associate: (models) => {
        Team.hasMany(models.User, {foreignKey: 'userId'})
      }
    },
    instanceMethods: {

    }
  })
  return Team;
}
