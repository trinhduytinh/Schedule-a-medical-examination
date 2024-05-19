"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule_Remote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule_Remote.belongsTo(models.User, {
        foreignKey: "doctorID",
        targetKey: "id",
        as: "doctorDataRemote"
      });
    }
  }
  Schedule_Remote.init(
    {
      currentNumber: DataTypes.INTEGER,
      maxNumber: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      doctorID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedule_Remote",
    }
  );
  return Schedule_Remote;
};
