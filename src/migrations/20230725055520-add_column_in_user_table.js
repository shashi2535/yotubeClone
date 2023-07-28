'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('user', 'role', {
      type: Sequelize.ENUM('0', '1'),
      allowNull: true,
      defaultValue: '0',
    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'role');
  },
};
