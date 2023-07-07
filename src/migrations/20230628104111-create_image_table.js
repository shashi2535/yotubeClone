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
      public_id: {
        type: Sequelize.STRING,
        trim: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        trim: true,
        references: {
          model: { tableName: 'user' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: true,
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      channel_id: {
        type: Sequelize.INTEGER,
        trim: true,
        references: {
          model: { tableName: 'channel' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: true,
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
