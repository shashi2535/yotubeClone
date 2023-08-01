module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.addColumn(
        'likes',
        'comment_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: { tableName: 'comment' }, // provide table name
            key: 'id', // PK of the User Model
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.removeColumn('likes', 'comment_id', { transaction: t });
    });
  },
};
