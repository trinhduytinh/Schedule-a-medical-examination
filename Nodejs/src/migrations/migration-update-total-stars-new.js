module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Doctor_Infor", "totalStars", {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
    ]);
  },
};