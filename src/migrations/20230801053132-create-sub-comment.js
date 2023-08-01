'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'comment' }, // provide table name
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
      sub_comment_uuid: {
        type: Sequelize.UUID,
      },
      sub_comment: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('sub_comment');
  },
};
