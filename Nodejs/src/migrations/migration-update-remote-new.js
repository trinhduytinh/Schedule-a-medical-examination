module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "remote", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn("Todo", "completed");
  },
};
