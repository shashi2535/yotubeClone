module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('video_track', 'start_time', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('video_track', 'end_time', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      }),
    ]);
  },
};
