import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();
let buildUrlEmail = (doctorId, token) => {
  let result = "";
  // let id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postBookAppointment = (data) => {
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
        // Fetch the schedule to check the currentNumber and maxNumber
        let schedule = await db.Schedule.findOne({
          where: {
            doctorID: data.doctorId,
            date: data.date,
            timeType: data.timeType
          }
        });

        if (!schedule) {
          resolve({
            errCode: 2,
            errMessage: "Schedule not found"
          });
        } else if (schedule.currentNumber >= schedule.maxNumber) {
          resolve({
            errCode: 3,
            errMessage: "Booking is full"
          });
        } else {
          // Generate token
          let token = uuidv4();

          // Upsert patient
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
            // Check if the user has already booked the same schedule
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
              // Send email
              await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token),
              });

              // Create booking
              await db.Booking.create({
                statusId: "S1",
                doctorId: data.doctorId,
                patientID: user[0].id,
                date: data.date,
                timeType: data.timeType,
                reason: data.reason,
                birthday: data.birthday,
                token: token,
              });

              // Increment currentNumber in schedule
              await db.Schedule.update(
                { currentNumber: schedule.currentNumber + 1 },
                { where: { id: schedule.id } }
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
      }
    } catch (e) {
      reject(e);
    }
  });
};



let postVerifyBookAppointment = (data) => {
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
let getListPatient = (email, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let idPatient = await db.User.findOne({
          where: {
            email: email,
          },
          attributes: ["id"],
        });
        let data = await db.Booking.findAll({
          where: {
            statusId: "S1",
            patientID: idPatient.id,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName"],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueJa", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "statusPatient",
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
let deleteListPatient = (id) => {
  return new Promise(async (resolve, reject) => {
    let booking = await db.Booking.findOne({
      where: { id: id },
    });
    if (!booking) {
      resolve({
        errCode: 2,
        errMessage: `The booking isn't exist`,
      });
    }
    await db.Booking.destroy({
      where: { id: id },
    });
    resolve({
      errCode: 0,
      errMessage: `The booking is deleted`,
    });
  });
};
module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  getListPatient: getListPatient,
  deleteListPatient: deleteListPatient,
};
