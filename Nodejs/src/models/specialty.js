"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Specialty.hasOne(models.Doctor_Infor, {
        foreignKey: "specialtyId",
        as: "specialtyTypeData",
      });
    }
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      nameJa: DataTypes.STRING,
      descriptionHTML: DataTypes.TEXT,
      descriptionHTMLEn: DataTypes.TEXT,
      descriptionHTMLJa: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      descriptionMarkdownEn: DataTypes.TEXT,
      descriptionMarkdownJa: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
