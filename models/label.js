module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define('Label', {
    name: DataTypes.STRING
  }, {});
  return Label;
};