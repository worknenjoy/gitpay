module.exports = function (sequelize, DataTypes) {
  const Team = sequelize.define('Team', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      AllowNull: false
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    timestamps: true,
  });
  return Team;
}
