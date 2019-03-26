'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
        name: 'admin',
        label: 'Adminstrator'
      },
      {
        name: 'owner',
        label: 'Owner'
      },
      {
        name: 'funding',
        label: 'Funding'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};