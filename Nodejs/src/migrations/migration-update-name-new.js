module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Specialties", "nameEn", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Specialties", "nameJa", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
};
