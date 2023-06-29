'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('avtar', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image_uuid: {
        type: Sequelize.UUID,
        trim: true,
      },
      avtar_url: {
        type: Sequelize.STRING,
        trim: true,
      },
      foriegn_id: {
        type: Sequelize.STRING,
        trim: true,
      },
      type: {
        type: Sequelize.ENUM,
        values: ['user', 'channel'],
        trim: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('avtar');
  },
};
