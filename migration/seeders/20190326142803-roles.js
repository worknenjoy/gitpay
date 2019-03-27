'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
        name: 'admin',
        label: 'Adminstrator'
      },
      {
        name: 'issue_owner',
        label: 'Owner'
      },
      {
        name: 'company_owner',
        label: 'Company owner'
      },
      {
        name: 'sponsor',
        label: 'Sponsor'
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