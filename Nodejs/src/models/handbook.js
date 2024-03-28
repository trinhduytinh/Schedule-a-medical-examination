"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Handbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Handbook.belongsTo(models.User, {foreignKey: 'doctorId', targetKey: "id", as: "doctorDataHandbook"})
    }
  }
  Handbook.init(
    {
      title: DataTypes.TEXT('long'),
      titleEn: DataTypes.TEXT('long'),
      titleJa: DataTypes.TEXT('long'),
      description: DataTypes.TEXT('long'),
      descriptionEn: DataTypes.TEXT('long'),
      descriptionJa: DataTypes.TEXT('long'),
      descriptionMarkdown: DataTypes.TEXT('long'),
      descriptionMarkdownEn: DataTypes.TEXT('long'),
      descriptionMarkdownJa: DataTypes.TEXT('long'),
      doctorId: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      
    },
    {
      sequelize,
      modelName: "Handbook",
    }
  );
  return Handbook;
};
