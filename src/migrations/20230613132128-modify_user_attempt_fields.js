module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.changeColumn(
                'user',
                'attempt',
                {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                },
                { transaction }
            );
        }),

    down: async (queryInterface, Sequelize) =>
        queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.changeColumn(
                'user',
                'attempt',
                {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                },
                { transaction }
            );
        }),
};
