module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("doctor_infor", "remote", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([queryInterface.removeColumn("users", "remote")]);
  },
};
