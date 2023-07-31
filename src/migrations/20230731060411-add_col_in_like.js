module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.addColumn(
        'likes',
        'reaction',
        {
          type: Sequelize.ENUM,
          values: ['like', 'dislike'],
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.removeColumn('likes', 'reaction', { transaction: t });
    });
  },
};
