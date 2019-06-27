'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      provider: null,
      email: 'user1@test.com',
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
      name: 'User1',
      username: 'user1',
      website: 'user1.com.br',
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
      updatedAt: '2019-06-24'
    },
    {
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
      updatedAt: '2019-06-24'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
