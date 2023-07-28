'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.sequelize.transaction((t) => {
    //   return Promise.all([
    //     queryInterface.addColumn(
    //       'table_name',
    //       'field_one_name',
    //       {
    //         type: Sequelize.STRING,
    //       },
    //       { transaction: t }
    //     ),
    //     queryInterface.addColumn(
    //       'table_name',
    //       'field_two_name',
    //       {
    //         type: Sequelize.STRING,
    //       },
    //       { transaction: t }
    //     ),
    //   ]);
    // });
    return queryInterface.sequelize.transaction((t) => {
      // return Promise.all([
      //   queryInterface.removeColumn('video', 'createdAt', { transaction: t }),
      //   queryInterface.removeColumn('video', 'updatedAt', { transaction: t }),
      // ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'video',
          'created_at',
          {
            allowNull: false,
            type: Sequelize.DATE,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'video',
          'updated_at',
          {
            allowNull: false,
            type: Sequelize.DATE,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
