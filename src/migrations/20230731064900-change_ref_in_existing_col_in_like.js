'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const transaction = await queryInterface.sequelize.transaction();
    // try {
    //   await queryInterface.remove('likes', 'user_id', { transaction });
    //   await queryInterface.addConstraint('likes', {
    //     fields: ['user_id'],
    //     type: 'foreign key',
    //     references: {
    //       table: 'user',
    //       field: 'id',
    //     },
    //   });
    //   return transaction.commit();
    // } catch (error) {
    //   await transaction.rollback();
    //   throw error;
    // }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('likes', 'user_id');
      await queryInterface.addColumn('likes', 'user_id', {
        type: Sequelize.INTEGER,
        trim: true,
        references: {
          model: { tableName: 'user' }, // provide table name
          key: 'id', // PK of the User Model
        },
        allowNull: false,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
