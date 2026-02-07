module.exports = function (sequelize, DataTypes) {
  const TeamMember = sequelize.define('TeamMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      AllowNull: false
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Team',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    timestamps: true,
  });
  TeamMember.associate = (model) => {
    TeamMember.belongsTo(model.Team,{
      foreignKey: 'team_id',
    });
    TeamMember.belongsTo(model.User,{
      foreignKey: 'user_id',
    });
  }
  return TeamMember;
}
