const db = require("../models");
import { translate } from "bing-translate-api";
import _, { includes } from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();
let getAllDoctorRemote = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let idDoctors = await db.Doctor_Infor.findAll({
        where: {
          remote: "RM",
        },
        attributes: ["doctorId"],
      });
      // Sử dụng map để lấy danh sách các doctorId
      let doctorIds = idDoctors.map((doctor) => doctor.doctorId);
      // Sử dụng danh sách doctorIds trong truy vấn Sequelize
      let doctors = await db.User.findAll({
        where: { id: doctorIds },
        attributes: {
          // Loại bỏ trường email
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
let bulkCreateScheduleRemote = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrScheduleRemote || !data.doctorID || !data.formateDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required param! ",
        });
      } else {
        let scheduleRemote = data.arrScheduleRemote;
        if (scheduleRemote && scheduleRemote.length > 0) {
          scheduleRemote = scheduleRemote.map((item) => {
            item.maxNumber = 1;
            return item;
          });
        }
        //get all existing data
        let existing = await db.Schedule_Remote.findAll({
          where: { doctorID: data.doctorID, date: data.formateDate },
          attributes: ["timeType", "date", "doctorID", "maxNumber"],
          raw: true,
        });
        //compare different
        let toCreate = _.differenceWith(scheduleRemote, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule_Remote.bulkCreate(toCreate);
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
let getScheduleRemoteByDate = (doctorID, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorID || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Schedule_Remote.findAll({
          where: {
            doctorID: doctorID,
            date: date,
          },
          include: [
            // {
            //   model: db.Allcode,
            //   as: "timeTypeData",
            //   attributes: ["valueEn", "valueVi"],
            // },
            {
              model: db.User,
              as: "doctorDataRemote",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
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
let getDetailSpecialtyRemoteById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "nameEn",
            "nameJa",
            "descriptionHTML",
            "descriptionHTMLEn",
            "descriptionHTMLJa",
            "descriptionMarkdown",
            "descriptionMarkdownEn",
            "descriptionMarkdownJa",
          ],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId, remote: "RM" },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            //find by location
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId, provinceId: location, remote: "RM" },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
        } else {
          data = {};
        }
        resolve({
          errMessage: "Ok",
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let buildUrlEmail = (doctorId, token) => {
  let result = "";
  // let id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postBookAppointmentRemote = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address ||
        !data.reason ||
        !data.phoneNumber ||
        !data.birthday
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });
        //upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phonenumber: data.phoneNumber,
          },
        });

        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientID: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientID: user[0].id,
              date: data.date,
              timeType: data.timeType,
              reason: data.reason,
              birthday: data.birthday,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor patient succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let postVerifyBookAppointmentRemote = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save({});
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getAllDoctorRemote: getAllDoctorRemote,
  bulkCreateScheduleRemote: bulkCreateScheduleRemote,
  getScheduleRemoteByDate: getScheduleRemoteByDate,
  getDetailSpecialtyRemoteById: getDetailSpecialtyRemoteById,
  postBookAppointmentRemote: postBookAppointmentRemote,
  postVerifyBookAppointmentRemote: postVerifyBookAppointmentRemote
};
