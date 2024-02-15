"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Clinics", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      addressEn: {
        type: Sequelize.STRING,
      },
      addressJa: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      nameEn: {
        type: Sequelize.STRING,
      },
      nameJa: {
        type: Sequelize.STRING,
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdownEn: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdownJa: {
        type: Sequelize.TEXT,
      },
      descriptionHTML: {
        type: Sequelize.TEXT,
      },
      descriptionHTMLEn: {
        type: Sequelize.TEXT,
      },
      descriptionHTMLJa: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.BLOB('long'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Clinics");
  },
};
