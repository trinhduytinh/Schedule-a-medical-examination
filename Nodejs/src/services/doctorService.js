import db from "../models/index";
import { translate } from "bing-translate-api";
import _, { reject } from "lodash";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limit,
        order: [["createdAt", "DESC"]], //sap xep theo ngay tao
        attributes: {
          //bo truong email
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          //bo truong email
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic ||
        !inputData.addressClinic ||
        !inputData.note
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let contentHTMLEn = "",
          contentHTMLJa = "",
          descriptionEn = "",
          descriptionJa = "";

        try {
          const translationHTMLen = await translate(
            inputData.contentHTML,
            null,
            "en"
          );
          contentHTMLEn = translationHTMLen.translation;

          const translationHTMLja = await translate(
            inputData.contentHTML,
            null,
            "ja"
          );
          contentHTMLJa = translationHTMLja.translation;

          const translationDescen = await translate(
            inputData.description,
            null,
            "en"
          );
          descriptionEn = translationDescen.translation;

          const translationDescja = await translate(
            inputData.description,
            null,
            "ja"
          );
          descriptionJa = translationDescja.translation;
        } catch (err) {
          console.error(err);
        }
        //upsert to Markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentHTMLEn: contentHTMLEn,
            contentHTMLJa: contentHTMLJa,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            descriptionEn: descriptionEn,
            descriptionJa: descriptionJa,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentHTMLEn = contentHTMLEn;
            doctorMarkdown.contentHTMLJa = contentHTMLJa;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.descriptionEn = descriptionEn;
            doctorMarkdown.descriptionJa = descriptionJa;
            await doctorMarkdown.save();
          }
        }

        //upsert to Doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });
        if (doctorInfor) {
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice.value;
          doctorInfor.provinceId = inputData.selectedProvince.value;
          doctorInfor.paymentId = inputData.selectedPayment.value;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice.value,
            provinceId: inputData.selectedProvince.value,
            paymentId: inputData.selectedPayment.value,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            //bo truong email
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: [
                "description",
                "descriptionEn",
                "descriptionJa",
                "contentHTML",
                "contentHTMLEn",
                "contentHTMLJa",
                "contentMarkdown",
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorID"],
              },
            //eager loading giúp load tất cả các entity trong 1 câu lệnh, tất cả các entity con sẽ được load ra trong 1 lần gọi duy nhấ
              include:[
                {model: db.Allcode, as: 'priceTypeData', attributes:['valueEn', 'valueJa', 'valueVi']},
                {model: db.Allcode, as: 'provinceTypeData', attributes:['valueEn', 'valueJa', 'valueVi']},
                {model: db.Allcode, as: 'paymentTypeData', attributes:['valueEn', 'valueJa', 'valueVi']}

              ]
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorID || !data.formateDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required param! ",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        //get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorID: data.doctorID, date: data.formateDate },
          attributes: ["timeType", "date", "doctorID", "maxNumber"],
          raw: true,
        });
        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getScheduleByDate = (doctorID, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorID || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorID: doctorID,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
          raw: false,
          nest: true,
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
};
