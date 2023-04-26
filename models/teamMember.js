const Team = require('./team');
const User = require('./user');

module.exports = function (sequelize, DataTypes) {
  const TeamMember = sequelize.define('TeamMembr', {
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
  TeamMember.belongsTo(Team, { foreignKey: 'team_id' });
  TeamMember.belongsTo(User, {foreignKey: 'user_id'});
};