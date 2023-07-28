'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('video', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      video_uuid: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      channel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'channel' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'user' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      },
      video_url: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      type: {
        type: Sequelize.ENUM('shorts', 'full_video'),
        defaultValue: null,
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('video');
  },
};
