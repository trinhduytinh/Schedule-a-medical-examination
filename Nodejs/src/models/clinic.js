"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Clinic.init(
    {
      name: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      nameJa: DataTypes.STRING,
      address: DataTypes.STRING,
      addressEn: DataTypes.STRING,
      addressJa: DataTypes.STRING,
      descriptionMarkdown: DataTypes.TEXT,
      descriptionMarkdownEn: DataTypes.TEXT,
      descriptionMarkdownJa: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT,
      descriptionHTMLEn: DataTypes.TEXT,
      descriptionHTMLJa: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
