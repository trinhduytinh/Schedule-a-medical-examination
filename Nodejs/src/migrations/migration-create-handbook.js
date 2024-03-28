"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("handbooks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT("long"),
      },
      titleEn: {
        allowNull: false,
        type: Sequelize.TEXT("long"),
      },
      titleJa: {
        allowNull: false,
        type: Sequelize.TEXT("long"),
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT("long"),
      },
      descriptionEn: {
        allowNull: true,
        type: Sequelize.TEXT("long"),
      },
      descriptionJa: {
        allowNull: true,
        type: Sequelize.TEXT("long"),
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
      doctorId: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("handbooks");
  },
};
