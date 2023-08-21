module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.addColumn(
        'video',
        'video_position',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.removeColumn('video', 'video_position', { transaction: t });
    });
  },
};
