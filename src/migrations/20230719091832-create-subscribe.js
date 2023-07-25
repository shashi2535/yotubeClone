'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscribe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subscribe_uuid: {
        type: Sequelize.STRING,
      },
      subscribed_channel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'channel' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      },
      subscribed_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'user' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscribe');
  },
};
