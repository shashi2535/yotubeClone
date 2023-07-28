/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const { genSalt, hash } = require('bcrypt');
const { v4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await genSalt(12);
    const hashPassword = await hash('password', salt);
    await queryInterface.bulkInsert(
      'user',
      [
        {
          email: 'admin@email.com',
          password: hashPassword,
          role: 1,
          user_uuid: v4(),
          first_name: 'admin',
          last_name: 'youtube',
          is_phone_varified: true,
          is_email_varified: true,
          phone: '9424042432',
          otp_expiration_time: null,
          reset_token: null,
          otp: null,
          token_expiration_time: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user',
      [
        {
          email: 'admin@email.com',
          password: '',
          role: 1,
          user_uuid: v4(),
          first_name: 'admin',
          last_name: 'youtube',
          is_phone_varified: true,
          is_email_varified: true,
          phone: '9424042432',
          otp_expiration_time: null,
          reset_token: null,
          otp: null,
          token_expiration_time: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
};
