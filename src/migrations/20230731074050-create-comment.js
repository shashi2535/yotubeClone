'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment_uuid: {
        type: Sequelize.UUID,
      },
      video_id: {
        type: Sequelize.INTEGER,
        trim: true,
        references: {
          model: { tableName: 'video' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        trim: true,
        references: {
          model: { tableName: 'user' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        trim: true,
      },
      video_uuid: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('comment');
  },
};
