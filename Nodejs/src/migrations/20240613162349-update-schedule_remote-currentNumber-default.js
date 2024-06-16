'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Schedule_Remotes', 'currentNumber', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Schedule_Remotes', 'currentNumber', {
      type: Sequelize.INTEGER,
      defaultValue: null,
    });
  }
};
