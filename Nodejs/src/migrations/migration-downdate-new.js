module.exports = {
  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([queryInterface.removeColumn("users", "remote")]);
  },
};
