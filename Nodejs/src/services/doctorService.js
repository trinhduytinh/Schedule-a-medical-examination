import db from "../models/index";
import { translate } from "bing-translate-api";
import _, { reject } from "lodash";
import emailService from "../services/emailService.js";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (limit === "ALL") {
        let users = await db.User.findAll({
          where: { roleId: "R2" },
          order: [["createdAt", "DESC"]], //sap xep theo ngay tao
          attributes: {
            //bo truong email
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi", "valueJa"],
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueEn", "valueVi", "valueJa"],
            },
            {
              model: db.Doctor_Infor,
              attributes: ["specialtyId"],
              //eager loading giúp load tất cả các entity trong 1 câu lệnh, tất cả các entity con sẽ được load ra trong 1 lần gọi duy nhấ
              include: [
                {
                  model: db.Specialty,
                  as: "specialtyTypeData",
                  attributes: ["name", "nameEn", "nameJa"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: users,
        });
      } else {
        let endDate = Date.now(); // Timestamp của ngày hiện tại
        let startDate = endDate - 7 * 24 * 60 * 60 * 1000; // Timestamp của ngày 7 ngày trước đó

        let bookingCounts = await db.Booking.findAll({
          where: {
            statusId: "S3",
            date: {
              [db.Sequelize.Op.between]: [startDate, endDate],
            },
          },
          attributes: [
            "doctorId",
            [db.Sequelize.fn("COUNT", "doctorId"), "bookingCount"],
          ],
          group: ["doctorId"],
          raw: true,
        });

        // Tạo một object để lưu số lần đặt lịch của mỗi bác sĩ
        let doctorBookingCounts = {};

        // Lặp qua kết quả đếm số lần đặt lịch của mỗi bác sĩ và lưu vào object doctorBookingCounts
        bookingCounts.forEach((booking) => {
          doctorBookingCounts[booking.doctorId] = booking.bookingCount;
        });

        let doctors;
        if (bookingCounts.length === 0) {
          // Nếu không có ai đặt lịch trong tuần, trả về tất cả bác sĩ
          doctors = await db.User.findAll({
            where: {
              roleId: "R2",
            },
            order: [["firstName", "DESC"]], 
            attributes: {
              exclude: ["password"],
            },
            include: [
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi", "valueJa"],
              },
              {
                model: db.Allcode,
                as: "genderData",
                attributes: ["valueEn", "valueVi", "valueJa"],
              },
              {
                model: db.Doctor_Infor,
                attributes: ["specialtyId"],
                include: [
                  {
                    model: db.Specialty,
                    as: "specialtyTypeData",
                    attributes: ["name", "nameEn", "nameJa"],
                  },
                ],
              },
            ],
            raw: true,
            nest: true,
          });
        } else {
          // Nếu có ai đặt lịch trong tuần, lấy chỉ các bác sĩ có đặt lịch
          doctors = await db.User.findAll({
            where: {
              id: Object.keys(doctorBookingCounts), // Chỉ lấy các bác sĩ có trong danh sách doctorBookingCounts
              roleId: "R2",
            },
            limit: +limit, // Sử dụng giới hạn nếu được truyền vào, ngược lại không có giới hạn
            attributes: {
              exclude: ["password"],
            },
            include: [
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi", "valueJa"],
              },
              {
                model: db.Allcode,
                as: "genderData",
                attributes: ["valueEn", "valueVi", "valueJa"],
              },
              {
                model: db.Doctor_Infor,
                attributes: ["specialtyId"],
                include: [
                  {
                    model: db.Specialty,
                    as: "specialtyTypeData",
                    attributes: ["name", "nameEn", "nameJa"],
                  },
                ],
              },
            ],
            raw: true,
            nest: true,
          });
        }

        // Thêm trường số lượng đặt lịch trong tuần qua vào mỗi bác sĩ trong kết quả trả về
        doctors.forEach((doctor) => {
          doctor.bookingCountLastWeek = doctorBookingCounts[doctor.id] || 0;
        });

        // Trả về kết quả với trường số lượng đặt lịch trong tuần qua
        resolve({
          errCode: 0,
          data: doctors,
        });
      }
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
let checkRequiredFields = (inputData) => {
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`,
        });
      } else {
        let contentHTMLEn = "",
          contentHTMLJa = "",
          descriptionEn = "",
          descriptionJa = "",
          addressClinicEn = "",
          addressClinicJa = "",
          nameClinicEn = "",
          nameClinicJa = "",
          noteEn = "",
          noteJa = "";
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
          const translationAddressClinicEn = await translate(
            inputData.addressClinic,
            null,
            "en"
          );
          addressClinicEn = translationAddressClinicEn.translation;
          const translationAddressClinicJa = await translate(
            inputData.addressClinic,
            null,
            "ja"
          );
          addressClinicJa = translationAddressClinicJa.translation;
          const translationNameClinicEn = await translate(
            inputData.nameClinic,
            null,
            "en"
          );
          nameClinicEn = translationNameClinicEn.translation;
          const translationNameClinicJa = await translate(
            inputData.nameClinic,
            null,
            "ja"
          );
          nameClinicJa = translationNameClinicJa.translation;
          const translationNoteEn = await translate(inputData.note, null, "en");
          noteEn = translationNoteEn.translation;
          const translationNoteJa = await translate(inputData.note, null, "ja");
          noteJa = translationNoteJa.translation;
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
          doctorInfor.nameClinicEn = nameClinicEn;
          doctorInfor.nameClinicJa = nameClinicJa;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.addressClinicEn = addressClinicEn;
          doctorInfor.addressClinicJa = addressClinicJa;
          doctorInfor.note = inputData.note;
          doctorInfor.noteEn = noteEn;
          doctorInfor.noteJa = noteJa;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice.value,
            provinceId: inputData.selectedProvince.value,
            paymentId: inputData.selectedPayment.value,
            nameClinic: inputData.nameClinic,
            nameClinicEn: nameClinicEn,
            nameClinicJa: nameClinicJa,
            addressClinic: inputData.addressClinic,
            addressClinicEn: addressClinicEn,
            addressClinicJa: addressClinicJa,
            note: inputData.note,
            noteEn: noteEn,
            noteJa: noteJa,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
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
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
                {
                  model: db.Specialty,
                  as: "specialtyTypeData",
                  attributes: ["name"],
                },
              ],
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
            {
              model: db.User,
              as: "doctorData",
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
let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          //eager loading giúp load tất cả các entity trong 1 câu lệnh, tất cả các entity con sẽ được load ra trong 1 lần gọi duy nhấ
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueJa", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueJa", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueJa", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });
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
let getProfileDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
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
              attributes: ["valueEn", "valueVi", "valueJa"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorID"],
              },
              //eager loading giúp load tất cả các entity trong 1 câu lệnh, tất cả các entity con sẽ được load ra trong 1 lần gọi duy nhấ
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
              ],
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
let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueJa", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
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
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.imgBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }

        //send email rêmdy
        await emailService.sendAttachment(data);
        resolve({
          errCode: 0,
          errMessage: "ok ",
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
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
};
