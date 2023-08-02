module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('likes', 'video_id', {
      type: Sequelize.INTEGER, // Replace with the appropriate data type
      allowNull: true, // This removes the NOT NULL constraint
      defaultValue: null, // If you want to set a default value, provide it here
      references: {
        model: { tableName: 'video' }, // provide table name
        key: 'id', // PK of the User Model
      },
    });
  },
  down: async (queryInterface, Sequelize) =>
    await queryInterface.changeColumn('likes', 'video_uuid', {
      type: Sequelize.STRING, // Replace with the appropriate data type
      allowNull: true, // This removes the NOT NULL constraint
      defaultValue: null, // If you want to set a default value, provide it here
    }),
};
