module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Types',
      [
        {
          name: 'funding',
          label: 'Funding',
          description: 'You will mostly fund issues',
          createdAt: '2019-06-24',
          updatedAt: '2019-06-24',
        },
        {
          name: 'contributor',
          label: 'Contributor',
          description: 'You will solve issues',
          createdAt: '2019-06-24',
          updatedAt: '2019-06-24',
        },
        {
          name: 'maintainer',
          label: 'Maintainer',
          description: 'You have a project',
          createdAt: '2019-06-24',
          updatedAt: '2019-06-24',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Types', null, {})
  },
}
