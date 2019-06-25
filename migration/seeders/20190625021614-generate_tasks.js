'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Tasks", [{
      provider: 'github',
      type: 'Bug',
      level: 'Advanced',
      status: 'open',
      deadline: '2019-08-24',
      url: 'https://github.com/worknenjoy/gitpay/issues/312',
      title: 'Task 1',
      value: 15,
      paid: false,
      notified: true,
      transfer_id: 1,
      assigned: null,
      createdAt: '2019-06-24',
      updatedAt: '2019-06-24'
    },
    {
      provider: 'github',
      type: 'Improvement',
      level: 'Beginner',
      status: 'open',
      deadline: '2019-12-24',
      url: 'https://github.com/worknenjoy/gitpay/issues/313',
      title: 'Task 2',
      value: 0,
      paid: false,
      notified: false,
      transfer_id: 1,
      assigned: null,
      createdAt: '2019-06-24',
      updatedAt: '2019-06-24'
    },
    {
      provider: 'github',
      type: 'Bug',
      level: 'Intermediate',
      status: 'open',
      deadline: '2020-01-04',
      url: 'https://github.com/worknenjoy/gitpay/issues/311',
      title: 'Task 3',
      value: 12,
      paid: false,
      notified: false,
      transfer_id: 1,
      assigned: null,
      createdAt: '2019-06-01',
      updatedAt: '2019-06-24'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tasks", null, {});
  }
};
