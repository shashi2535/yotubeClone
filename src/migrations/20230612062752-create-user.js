'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_uuid: {
                type: Sequelize.UUID,
                trim: true,
            },
            first_name: {
                type: Sequelize.STRING,
                trim: true,
            },
            last_name: {
                type: Sequelize.STRING,
                trim: true,
            },
            email: {
                type: Sequelize.STRING,
                trim: true,
            },
            password: {
                type: Sequelize.STRING,
                trim: true,
            },
            role: {
                type: Sequelize.ENUM,
                values: ['user', 'admin'],
            },
            is_phone_varified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            otp_expiration_time: {
                type: Sequelize.DATE,
            },
            reset_token: {
                type: Sequelize.STRING,
                trim: true,
            },
            otp: {
                type: Sequelize.INTEGER,
            },
            is_email_varified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            attempt: {
                type: Sequelize.INTEGER,
            },
            is_blocked: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            blocked_at: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('user');
    },
};
