'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'user',
          'token_expiration_time',
          {
            type: Sequelize.DATE,
            defaultValue: null,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('user', 'token_expiration_time', {
          transaction: t,
        }),
      ]);
    });
  },
};
