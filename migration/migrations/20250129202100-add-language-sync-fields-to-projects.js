'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add language sync tracking fields to Projects table
    await queryInterface.addColumn('Projects', 'lastLanguageSync', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Timestamp of last programming languages sync from GitHub'
    });

    await queryInterface.addColumn('Projects', 'languageHash', {
      type: Sequelize.STRING(32),
      allowNull: true,
      comment: 'MD5 hash of current programming languages for change detection'
    });

    await queryInterface.addColumn('Projects', 'languageEtag', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'ETag from GitHub API for conditional requests'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Projects', 'languageEtag');
    await queryInterface.removeColumn('Projects', 'languageHash');
    await queryInterface.removeColumn('Projects', 'lastLanguageSync');
  }
};
