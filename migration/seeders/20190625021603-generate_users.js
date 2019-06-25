'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      provider: null,
      email: 'victor.alessander.gr@gmail.com',
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
      name: 'Victor',
      username: 'victoralessander',
      website: 'victoralessander.github.io',
      repos: null,
      language: null,
      country: 'Brasil',
      profile_url: null,
      picture_url: null,
      customer_id: null,
      account_id: null,
      paypal_id: null,
      os: null,
      languages: null,
      receiveNotifications: true,
      createdAt: '2019-06-24',
      updatedAt: null
    }],
    [{
      provider: null,
      email: 'usuario2@teste.com',
      password: bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
      name: 'UsuarioTeste',
      username: 'usuario2',
      website: null,
      repos: null,
      language: null,
      country: 'Brasil',
      profile_url: null,
      picture_url: null,
      customer_id: null,
      account_id: null,
      paypal_id: null,
      os: null,
      languages: null,
      receiveNotifications: false,
      createdAt: '2019-06-11',
      updatedAt: null
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
