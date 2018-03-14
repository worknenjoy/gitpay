'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        username: DataTypes.STRING,
        website: DataTypes.STRING,
        repos: DataTypes.STRING,
        picture_url: DataTypes.STRING,
    }, {
        classMethods: {
            associate: (models) => {
                // associations can be defined here
            },
            generateHash: (password) => {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            }
        },
        instanceMethods: {
            verifyPassword: (password, databasePassword) => {
                return bcrypt.compareSync(password, databasePassword);
            }
        }
    });

    return User;
};
