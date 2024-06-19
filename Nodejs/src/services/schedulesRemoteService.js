const db = require("../models");
import { translate } from "bing-translate-api";
import _, { includes, orderBy } from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
const PayOS = require("@payos/node"); // thanh toan hoa don
require("dotenv").config();
const { Op } = require("sequelize");
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.CHECKSUM_KEY
);
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
let updateScheduleRemote = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrScheduleRemote || !data.doctorID || !data.formateDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let scheduleRemote = data.arrScheduleRemote;
        if (scheduleRemote && scheduleRemote.length > 0) {
          scheduleRemote = scheduleRemote.map((item) => {
            item.maxNumber = 1;
            return item;
          });
        }
        // Nhận tất cả dữ liệu hiện có
        let existing = await db.Schedule_Remote.findAll({
          where: { doctorID: data.doctorID, date: data.formateDate },
          attributes: ["timeType", "date", "doctorID", "maxNumber"],
          raw: true,
        });
        // Xác định lịch trình cần xóa
        let toDelete = _.differenceWith(existing, scheduleRemote, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        // Xác định lịch trình để tạo
        let toCreate = _.differenceWith(scheduleRemote, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        // Thực hiện xóa
        if (toDelete && toDelete.length > 0) {
          await db.Schedule_Remote.destroy({
            where: {
              doctorID: data.doctorID,
              date: data.formateDate,
              timeType: { [Op.in]: toDelete.map((item) => item.timeType) },
            },
          });
        }

        // Perform creations
        if (toCreate && toCreate.length > 0) {
          await db.Schedule_Remote.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "Schedule_Remote updated successfully!",
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
              where: {
                specialtyId: inputId,
                provinceId: location,
                remote: "RM",
              },
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
  result = `${process.env.URL_REACT}/verify-booking-remote?token=${token}&doctorId=${doctorId}`;
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
        // Lấy lịch trình để kiểm tra currentNumber và maxNumber
        let scheduleRemote = await db.Schedule_Remote.findOne({
          where: {
            doctorID: data.doctorId,
            date: data.date,
            timeType: data.timeType,
          },
        });
        if (!scheduleRemote) {
          resolve({
            errCode: 2,
            errMessage: "Schedule Remote not found",
          });
        } else if (scheduleRemote.currentNumber >= scheduleRemote.maxNumber) {
          resolve({
            errCode: 3,
            errMessage: "Booking is full",
          });
        } else {
          // Generate token
          let token = uuidv4();

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
            // Kiểm tra xem người dùng đã đặt lịch tương tự chưa
            let existingBooking = await db.Booking.findOne({
              where: {
                patientID: user[0].id,
                doctorId: data.doctorId,
                date: data.date,
                timeType: data.timeType,
              },
            });
            if (existingBooking) {
              resolve({
                errCode: 4,
                errMessage: "You have already booked this schedule",
              });
            } else {
              await emailService.sendSimpleEmailRemote({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token),
              });
              // Create booking
              await db.Booking.create({
                statusId: "RM",
                doctorId: data.doctorId,
                patientID: user[0].id,
                date: data.date,
                timeType: data.timeType,
                reason: data.reason,
                birthday: data.birthday,
                token: token,
              });

              // Increment currentNumber in schedule
              await db.Schedule_Remote.update(
                { currentNumber: scheduleRemote.currentNumber + 1 },
                { where: { id: scheduleRemote.id } }
              );

              resolve({
                errCode: 0,
                errMessage: "Save info patient succeed!",
              });
            }
          } else {
            resolve({
              errCode: 5,
              errMessage: "User creation failed",
            });
          }
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
let getListPatientRemoteForDoctor = (doctorId, date) => {
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
            statusId: "RM",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender", "phonenumber"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueJa", "valueVi"],
                },
              ],
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
let createPaymentBookingRemote = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.fullName ||
        !data.email ||
        !data.phoneNumber ||
        !data.address ||
        !data.doctorId ||
        !data.timeType
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let scheduleRemote = await db.Schedule_Remote.findOne({
          where: {
            doctorID: data.doctorId,
            date: data.date,
            timeType: data.timeType,
          },
        });
        if (!scheduleRemote) {
          resolve({
            errCode: 2,
            errMessage: "Schedule not found",
          });
        } else if (scheduleRemote.currentNumber >= scheduleRemote.maxNumber) {
          resolve({
            errCode: 3,
            errMessage: "Booking is full",
          });
        } else {
          let inforDoctor = await db.Doctor_Infor.findOne({
            where: { doctorId: data.doctorId },
            include: [
              {
                model: db.Allcode,
                as: "priceTypeData",
                attributes: ["valueEn", "valueJa", "valueVi"],
              },
            ],
            raw: true,
          });

          if (!inforDoctor) {
            return resolve({
              errCode: 2,
              errMessage: "Doctor not found",
            });
          }
          const encodedData = encodeURIComponent(JSON.stringify(data));
          const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (Unix Timestamp)
          const expiredAt = currentTime + 5 * 60; // Thời gian hết hạn sau 5 phút

          const body = {
            orderCode: Date.now(),
            amount: +inforDoctor["priceTypeData.valueVi"],
            description: "Thanh toán hóa đơn",
            buyerName: data.fullName,
            buyerEmail: data.email,
            buyerPhone: data.phoneNumber,
            buyerAddress: data.address,
            items: [
              {
                name: `Bác sĩ: ${data.doctorName}`,
                quantity: 1,
                price: +inforDoctor["priceTypeData.valueVi"],
              },
            ],
            returnUrl: `${process.env.URL_REACT}/pay-success?data=${encodedData}`,
            cancelUrl: `${process.env.URL_REACT}/pay-cancel`,
            expiredAt: expiredAt, // Thêm thuộc tính expiredAt vào đối tượng body
          };

          const paymentLink = await payOS.createPaymentLink(body);
          resolve({
            errCode: 0,
            paymentLink: paymentLink,
          });
        }
      }
    } catch (e) {
      console.error("Error in createPaymentBookingRemote:", e);
      reject({
        errCode: -1,
        errMessage: "Error from the server",
      });
    }
  });
};

module.exports = {
  getAllDoctorRemote: getAllDoctorRemote,
  bulkCreateScheduleRemote: bulkCreateScheduleRemote,
  getScheduleRemoteByDate: getScheduleRemoteByDate,
  getDetailSpecialtyRemoteById: getDetailSpecialtyRemoteById,
  postBookAppointmentRemote: postBookAppointmentRemote,
  postVerifyBookAppointmentRemote: postVerifyBookAppointmentRemote,
  getListPatientRemoteForDoctor: getListPatientRemoteForDoctor,
  createPaymentBookingRemote: createPaymentBookingRemote,
  updateScheduleRemote: updateScheduleRemote,
};
