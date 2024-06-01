"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor_Infor.belongsTo(models.User, {foreignKey: 'doctorId'})
      Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData'})
      Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData'})
      Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData'})
      Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'remote', targetKey: 'keyMap', as: 'remoteTypeData'})
      Doctor_Infor.belongsTo(models.Specialty, { foreignKey: 'specialtyId', targetKey: 'id', as: 'specialtyTypeData'})
    }
  }
  Doctor_Infor.init(
    {
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      addressClinicEn: DataTypes.STRING,
      addressClinicJa: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      nameClinicEn: DataTypes.STRING,
      nameClinicJa: DataTypes.STRING,
      note: DataTypes.STRING,
      noteEn: DataTypes.STRING,
      noteJa: DataTypes.STRING,
      count: DataTypes.INTEGER,
      remote: DataTypes.STRING,
      totalStars: DataTypes.FLOAT
    },
    {
      sequelize,
      modelName: "Doctor_Infor",
      freezeTableName: true,
    }
  );
  return Doctor_Infor;
};
