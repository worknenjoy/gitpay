'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
        name: 'admin',
        label: 'Adminstrator',
        createdAt: '2019-06-24',
        updatedAt: '2019-06-24'
      },
      {
        name: 'issue_owner',
        label: 'Owner',
        createdAt: '2019-06-24',
        updatedAt: '2019-06-24'
      },
      {
        name: 'company_owner',
        label: 'Company owner',
        createdAt: '2019-06-24',
        updatedAt: '2019-06-24'
      },
      {
        name: 'sponsor',
        label: 'Sponsor',
        createdAt: '2019-06-24',
        updatedAt: '2019-06-24'
      },
      {
        name: 'funding',
        label: 'Funding',
        createdAt: '2019-06-24',
        updatedAt: '2019-06-24'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};